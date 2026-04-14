import { useState, useEffect, useRef, useCallback } from 'react';
import { PenTool, ToggleRight, Trash2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Note } from '../lib/types';
import { X, Image as ImageIcon, Video, Loader2, BoldIcon, ItalicIcon, List, Link2 as Link, Code, Quote, Strikethrough, Underline, Undo, Redo, Eye, Type, SeparatorHorizontal } from 'lucide-react';

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
      });
    } else {
      setFormData({ title: '', content: '', image: '', video_url: '' });
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
      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update({
            title: formData.title,
            content: formData.content,
            image: formData.image || null,
            video_url: formData.video_url || null,
          })
          .eq('id', editingNote.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert({
            title: formData.title,
            content: formData.content,
            image: formData.image || null,
            video_url: formData.video_url || null,
            category_id: selectedCategory.id,
          });
        if (error) throw error;
      }
      onNoteAdded();
      if (onClose) onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed');
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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
              <button type="button" onClick={() => execCommand('formatBlock', 'h1')} className="p-2 sm:p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" title="عنوان رئيسي (H1)">
                <Type className="w-4 h-4" /> H1
              </button>
              <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" title="عنوان جانبي (H2)">
                <Type className="w-4 h-4 scale-75" /> H2
              </button>
              <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-3 hover:bg-blue-200 rounded-xl transition-all" title="خط جديد / فاصل">
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
                className="w-full min-h-40 sm:min-h-[250px] p-3 sm:p-6 border-2 border-dashed border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 ring-blue-500/20 bg-white text-sm sm:text-base leading-relaxed outline-none resize-none prose prose-slate [&_h1]:text-2xl [&_h1]:font-black [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_strong]:font-bold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700 [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-6" 
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

