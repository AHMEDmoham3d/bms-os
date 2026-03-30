import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Note } from '../lib/types';
import { X, Image as ImageIcon, Video, Loader2, BoldIcon, ItalicIcon, List, Link2 as Link, Code, Quote, Strikethrough, Underline, Undo, Redo, Eye } from 'lucide-react';

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
      const plainText = contentRef.current.innerText || '';
      setFormData(prev => ({ ...prev, content: plainText }));
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
      }
    }
  }, []);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (ctx && canvasRef.current) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || !canvasRef.current) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const handleDraw = () => {
    if (contentRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        document.execCommand('insertImage', false, dataUrl);
        updateContent();
        // Clear canvas
        const ctx = ctxRef.current;
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
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
              <button type="button" onClick={handleBold} className="p-2 sm:p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1">
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

              {/* Draw Canvas - Hidden but available */}
              <div className="hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  className="border border-gray-300 rounded-lg bg-white cursor-crosshair"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border ml-auto">
                <Eye className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" onClick={togglePreview} />
                <svg onClick={handleDraw} className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform stroke-gray-700 hover:stroke-blue-600" viewBox="0 0 24 24" fill="none"><path d="M12 20.25c-4.972 0-9-3.815-9-8.5s4.028-8.5 9-8.5 9 3.815 9 8.5-4.028 8.5-9 8.5Z" strokeWidth="1.5"/><path d="M17.5 11.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z" strokeWidth="1.5"/><path d="M6.763 17.237a.75.75 0 0 0 1.06-.04l1.342-1.253a3 3 0 0 1 4.814 0l1.342 1.253a.75.75 0 0 0 1.06.04l.345-.325a.75.75 0 0 0 .04-1.06l-1.342-1.253a3 3 0 0 1 0-4.814L18.11 6.112a.75.75 0 0 0-.04-1.06l-.345-.325a.75.75 0 0 0-1.06.04l-1.342 1.253a3 3 0 0 1-4.814 0L8.823 6.112a.75.75 0 0 0-1.06-.04l-.345.325a.75.75 0 0 0-.04 1.06l1.342 1.253a3 3 0 0 1 0 4.814l-1.342 1.253a.75.75 0 0 0 .04 1.06l.345.325Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div> 
            </div>

            <div className={!showPreview ? 'flex' : 'hidden'}>
                <div
                ref={contentRef}
                contentEditable
                onInput={updateContent}
                className="w-full min-h-40 sm:min-h-[250px] p-3 sm:p-6 border-2 border-dashed border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 ring-blue-500/20 bg-white text-sm sm:text-base leading-relaxed outline-none resize-none [&_strong]:font-bold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700"
                suppressContentEditableWarning={true}
                dir="auto"
              />
            </div>

{showPreview && (
              <div className="min-h-[250px] p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 prose prose-gray max-w-none leading-relaxed whitespace-pre-wrap" dir="auto">
                {formData.content || 'No content'}
              </div>
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

