import { useState, useEffect, useRef, useCallback } from 'react';
import { PenTool, ToggleRight, Trash2, Download, X, Image as ImageIcon, Video, Loader2, BoldIcon, ItalicIcon, List, Link2 as Link, Code, Quote, Strikethrough, Underline, Undo, Redo, Eye, Type, SeparatorHorizontal, AlignLeft, AlignCenter, AlignRight, Indent, Outdent } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Note } from '../lib/types';



interface NoteFormProps {
  selectedCategory: Category;
  onNoteAdded: () => void;
  editingNote?: Note;
  onClose?: () => void;
  inline?: boolean;
}

export default function NoteForm({ selectedCategory, onNoteAdded, editingNote, onClose, inline }: NoteFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    video_url: '',
    tags: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high',
    pinned: false,
    template: '',
    workspace_id: null as number | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // Drawing states
  const [showDrawingPanel, setShowDrawingPanel] = useState(false);
  const [penMode, setPenMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(3);
  const contentRef = useRef<HTMLDivElement>(null);

    // Load data
  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title,
        content: editingNote.content,
        image: editingNote.image || '',
        video_url: editingNote.video_url || '',
        tags: editingNote.tags || [],
        priority: editingNote.priority || 'medium',
        pinned: editingNote.pinned || false,
        template: editingNote.template || '',
        workspace_id: editingNote.workspace_id || null,
      });
    } else {
      const currentWsIdStr = localStorage.getItem('current_workspace_id');
      const currentWsId = currentWsIdStr ? parseInt(currentWsIdStr) : null;
      setFormData({ 
        title: '', content: '', image: '', video_url: '', tags: [], priority: 'medium', pinned: false, template: '',
        workspace_id: currentWsId || null 
      });
    }
  }, [editingNote]);

  const updateContent = useCallback(() => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML || '';
      setFormData(prev => ({ ...prev, content: htmlContent }));
    }
  }, []);

  const execCommand = (command: string, value?: string) => {
    console.log('Toolbar:', command, value); // Debug
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand(command, false, value);
      contentRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      updateContent();
    }
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrike = () => execCommand('strikeThrough');
  const handleUl = () => execCommand('insertUnorderedList');
  const handleOl = () => execCommand('insertOrderedList');
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };
  const handleUndo = () => document.execCommand('undo');
  const handleRedo = () => document.execCommand('redo');
  const handleCode = () => {
    const code = prompt('Enter code:');
    if (code && contentRef.current) {
      document.execCommand('insertHTML', false, `<pre><code>${code}</code></pre>`);
      updateContent();
    }
  };
  const handleQuote = () => execCommand('formatBlock', '<blockquote>');
  const handleIndent = () => execCommand('indent');
  const handleOutdent = () => execCommand('outdent');
  const handleJustifyLeft = () => execCommand('justifyLeft');
  const handleJustifyCenter = () => execCommand('justifyCenter');
  const handleJustifyRight = () => execCommand('justifyRight');

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
      }
    }
  }, [drawingColor, lineWidth]);

  // Advanced drawing handlers with pen detection
  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasRef.current!.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current!.height / rect.height)
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (penMode && e.pointerType !== 'pen') return;
    const ctx = ctxRef.current;
    if (ctx && canvasRef.current) {
      const pos = getPointerPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setLastX(pos.x);
      setLastY(pos.y);
      setIsDrawing(true);
      canvasRef.current!.setPointerCapture(e.pointerId);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !ctxRef.current) return;
    if (penMode && e.pointerType !== 'pen') return;
    const ctx = ctxRef.current;
    const pos = getPointerPos(e);
    const pressure = e.pressure || 0.5;
    ctx.lineWidth = lineWidth * pressure;
    ctx.strokeStyle = drawingColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastX(pos.x);
    setLastY(pos.y);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  };

  const insertDrawing = () => {
    if (contentRef.current && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      document.execCommand('insertImage', false, dataUrl);
      updateContent();
      clearCanvas();
    }
  };

  const togglePreview = () => setShowPreview(!showPreview); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateContent();
    if (!formData.title.trim()) return alert('Title required');

    setSubmitting(true);
    try {
      const currentWsIdStr = localStorage.getItem('current_workspace_id');
      const currentWsId = currentWsIdStr ? parseInt(currentWsIdStr) : null;
      
      // Full payload
      const payload = {
        title: formData.title.slice(0, 100),
        content: formData.content.slice(0, 10000),
        image: formData.image || null,
        video_url: formData.video_url || null,
        tags: formData.tags,
        priority: formData.priority,
        pinned: formData.pinned,
        template: formData.template || null,
        workspace_id: currentWsId || formData.workspace_id || null,
        category_id: selectedCategory.id,
      };
      
      console.log('🔄 Supabase payload:', payload);
      
      let result;
      if (editingNote) {
        result = await supabase
          .from('notes')
          .update(payload)
          .eq('id', editingNote.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('notes')
          .insert({
            ...payload,
            category_id: selectedCategory.id,
          })
          .select()
          .single();
      }
      
      const { data, error } = result;
      if (error) {
        console.error('💥 SUPABASE ERROR:', error);
        console.error('Status:', (error as any).status || 'N/A');
        console.error('Code:', error.code || 'N/A');
        console.error('Details:', (error as any).details || 'N/A');
        console.error('Message:', error.message || 'N/A');
        alert(`Error: ${error.message || 'Unknown Supabase error - check console'}`);
        throw error;
      }
      
      console.log('✅ Saved:', data);
      onNoteAdded();
      if (onClose) onClose();
    } catch (error: any) {
      console.error('💥 Save failed completely:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 ${inline ? 'w-full' : 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'}`} onClick={!inline ? onClose : undefined}>
      <div className={`${inline ? '' : 'bg-white w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border max-h-[90vh] overflow-auto'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{editingNote ? 'Edit Note' : 'New Note'}</h2>
          {!inline && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl"><X className="w-6 h-6" /></button>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">Title *</label>
              <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              placeholder="Enter compelling title..."
              disabled={submitting}
              required
            />
          </div>

          {/* New Pro Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Priority</label>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value as 'low'|'medium'|'high'})}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 ring-blue-500 focus:border-blue-500 text-sm font-semibold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide cursor-pointer hover:text-slate-800">
                <input 
                  type="checkbox" 
                  checked={formData.pinned}
                  onChange={e => setFormData({...formData, pinned: e.target.checked})}
                  className="w-4 h-4 rounded focus:ring-2 ring-blue-500"
                />
                Pin to Top
              </label>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Template</label>
              <select 
                value={formData.template} 
                onChange={e => {
                  const temp = e.target.value;
                  setFormData({...formData, template: temp});
                  // Auto-fill content
                  const templates = {
                    meeting: '<h2>Meeting Notes</h2><p><strong>Date:</strong> </p><p><strong>Attendees:</strong> </p><h3>Agenda:</h3><ul><li></li></ul><h3>Action Items:</h3><ul><li>Owner: <strong></strong> Due: </li></ul><h3>Decisions:</h3><p></p>',
                    task: '<h2>Task List</h2><p><strong>Priority:</strong> </p><ul><li><input type="checkbox"> Task 1</li></ul>',
                    report: '<h1>Weekly Report</h1><p><strong>Period:</strong> </p><h2>Accomplishments:</h2><ul></ul><h2>Challenges:</h2><ul></ul><h2>Next Steps:</h2><ul></ul>',
                  };
                  if (temp && contentRef.current && templates[temp as keyof typeof templates]) {
                    contentRef.current.innerHTML = templates[temp as keyof typeof templates];
                    updateContent();
                  }
                }}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">No Template</option>
                <option value="meeting">Meeting Notes</option>
                <option value="task">Task List</option>
                <option value="report">Weekly Report</option>
              </select>
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">Tags (comma separated)</label>
            <div className="flex flex-wrap gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl min-h-[44px] items-center focus-within:border-blue-500 focus-within:ring-2 ring-blue-200/50 bg-slate-50/50">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag) })}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={formData.tags[formData.tags.length - 1] || ''}
                onChange={e => {
                  const value = e.target.value;
                  if (value.includes(',')) {
                    const newTags = value.split(',').map(t => t.trim()).filter(t => t);
                    setFormData({...formData, tags: [...formData.tags.slice(0, -1), ...newTags]});
                    return;
                  }
                  const tags = [...formData.tags.slice(0, -1), value];
                  setFormData({...formData, tags});
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const value = formData.tags[formData.tags.length - 1]?.trim();
                    if (value) {
                      setFormData({...formData, tags: [...formData.tags.slice(0, -1), value]});
                    }
                  }
                }}
                placeholder={formData.tags.length === 0 ? 'meeting, task, urgent...' : ''}
                className="flex-1 bg-transparent border-none outline-none p-0 text-sm placeholder-slate-500 focus:ring-0"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
              <button type="button" onClick={() => execCommand('formatBlock', 'h1')} className="p-2 sm:p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" title="Main Heading (H1)">
                <Type className="w-4 h-4" /> H1
              </button>
              <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" title="Secondary Heading (H2)">
                <Type className="w-4 h-4 scale-75" /> H2
              </button>
              <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-3 hover:bg-blue-200 rounded-xl transition-all" title="New Line / Separator">
                <SeparatorHorizontal className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleBold} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1">
                <BoldIcon className="w-4 h-4" /> B
              </button>
              <button type="button" onClick={handleItalic} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1">
                <ItalicIcon className="w-4 h-4" /> I
              </button>
              <button type="button" onClick={handleUnderline} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1">
                <Underline className="w-4 h-4" /> U
              </button>
              <button type="button" onClick={handleStrike} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Strikethrough className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleUl} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <List className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleOl} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <List className="w-4 h-4 rotate-180" />
              </button>
              <button type="button" onClick={handleLink} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Link className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleCode} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Code className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleQuote} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Quote className="w-4 h-4" />
              </button>
              <div className="w-px h-8 bg-blue-200 mx-1 hidden sm:block" />
              <button type="button" onClick={handleJustifyLeft} className="p-3 hover:bg-blue-200 rounded-xl" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleJustifyCenter} className="p-3 hover:bg-blue-200 rounded-xl" title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleJustifyRight} className="p-3 hover:bg-blue-200 rounded-xl" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleIndent} className="p-3 hover:bg-blue-200 rounded-xl" title="Increase Indent">
                <Indent className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleOutdent} className="p-3 hover:bg-blue-200 rounded-xl" title="Decrease Indent">
                <Outdent className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleUndo} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Undo className="w-4 h-4" />
              </button>
            <button type="button" onClick={handleRedo} className="p-3 hover:bg-blue-200 rounded-xl transition-all">
                <Redo className="w-4 h-4" />
              </button>
              {/* Group separator for better formatting */}
              <div className="w-px h-8 bg-blue-200 mx-2 hidden sm:block" />

              <button type="button" onClick={() => setShowDrawingPanel(!showDrawingPanel)} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" title="Toggle Drawing">
                <PenTool className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border ml-auto">
                <Eye className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" onClick={togglePreview} />
              </div> 
            </div>

            <div className={!showPreview ? 'flex flex-col' : 'hidden'}>
                <div
                ref={contentRef}
                contentEditable
                onInput={updateContent}
                className="w-full min-h-40 sm:min-h-[250px] p-6 border-2 border-dashed border-slate-200 rounded-3xl focus:border-blue-500 focus:ring-4 ring-blue-200/50 bg-gradient-to-br from-slate-50 to-white text-base leading-7 font-[Cairo] direction-rtl prose prose-slate prose-headings:font-black prose-headings:text-slate-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-em:italic prose-li:leading-relaxed prose-blockquote:border-r-4 prose-blockquote:border-blue-400 prose-blockquote:pr-4 prose-pre:bg-slate-900 prose-code:bg-slate-100 [&_ul]:list-disc [&_ol]:list-decimal pl-8 [&_hr]:border-slate-300 [&_hr]:my-8 [&_div[style*='text-align:'][style*='left']]:text-left [&_div[style*='text-align:'][style*='center']]:text-center [&_div[style*='text-align:'][style*='right']]:text-right outline-none resize-none shadow-inner hover:shadow-md transition-all" 
                suppressContentEditableWarning={true}
                dir="auto"
              />
              {showDrawingPanel && (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                  <div className="flex flex-wrap gap-2 mb-3 items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-800">
                      <PenTool className="w-4 h-4" />
                      Digital Pen Drawing
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-lg border cursor-pointer hover:bg-indigo-100">
                        <ToggleRight className="w-3 h-3" />
                        Pen Only
                        <input type="checkbox" checked={penMode} onChange={(e) => setPenMode(e.target.checked)} className="ml-1" />
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4 p-2 bg-white rounded-xl border">
                    <input
                      type="color"
                      value={drawingColor}
                      onChange={(e) => setDrawingColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-indigo-300"
                    />
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={lineWidth}
                      onChange={(e) => setLineWidth(Number(e.target.value))}
                      className="flex-1 h-8 accent-indigo-500"
                    />
                    <span className="w-8 text-center text-sm font-bold text-indigo-800">{lineWidth}px</span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={endDrawing}
                    onPointerLeave={endDrawing}
                    onPointerCancel={endDrawing}
                    className="w-full h-64 sm:h-80 border-2 border-indigo-300 rounded-2xl bg-white cursor-crosshair shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <div className="flex gap-2 mt-3 pt-3 border-t border-indigo-200">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="flex-1 p-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl border border-red-300 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={insertDrawing}
                      className="flex-1 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-indigo-500"
                    >
                      <Download className="w-4 h-4" />
                      Insert Drawing
                    </button>
                  </div>
                </div>
              )}
            </div>

{showPreview && (
              <div 
                className="min-h-[250px] p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 prose prose-gray max-w-none leading-relaxed prose-headings:text-slate-900 prose-headings:font-black" 
                dir="auto"
                dangerouslySetInnerHTML={{ __html: formData.content || 'No content' }} 
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <ImageIcon className="w-4 h-4" />
                Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-4 ring-blue-500/20 focus:border-blue-500 pr-24 sm:pr-28"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img src={formData.image} className="absolute top-1 right-1 w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white shadow-md" onError={e => e.currentTarget.style.display = 'none'} />
                )}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Video className="w-4 h-4" />
                Video Embed
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={e => setFormData({...formData, video_url: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 ring-blue-500/20 focus:border-blue-500 pr-28"
                  placeholder="https://youtube.com/embed/..."
                />
                {formData.video_url && (
                  <iframe src={formData.video_url} className="absolute top-1 right-1 w-20 h-14 rounded-lg border-2 border-white shadow-md" allowFullScreen />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button
              type="submit"
              disabled={submitting || !formData.title.trim()}
              className="flex-1 bg-gradient-to-r from-slate-900 to-gray-900 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 transition-all focus:ring-4 ring-slate-500/50 hover:from-slate-800 hover:to-gray-800 border border-slate-800/50 hover:border-slate-700/50"
            >
              {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              {submitting ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-12 py-4 border border-gray-300 text-gray-900 rounded-xl font-bold hover:bg-gray-100 hover:shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

