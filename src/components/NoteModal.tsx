import { useEffect, useRef, useState } from 'react';
import { X, Video, Bold, Italic, Underline, Strikethrough, List, Link2, Code, Quote, Undo, Redo, PenTool, Eye, Clock, Type, SeparatorHorizontal, Table } from 'lucide-react';
import type { Note, Category } from '../lib/types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onUpdateNote?: (noteId: number, updates: Partial<Note>) => Promise<void>;
  categories?: Category[];
}

export default function NoteModal({ isOpen, onClose, note, onUpdateNote, categories = [] }: NoteModalProps) {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#000000');
  const [category, setCategory] = useState('');
  const editableRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      const cat = categories.find(c => c.id === note.category_id);
      setCategory(cat?.name || 'General');
    }
  }, [note, categories]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = drawColor;
      }
    }
  }, [drawColor]);

  const formatText = (command: string, value?: string) => {
    if (editableRef.current) {
      document.execCommand(command, false, value);
      editableRef.current.focus();
    }
  };

  const handleDrawing = (e: React.MouseEvent) => {
    if (!ctxRef.current || !isDrawing) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (e.type === 'mousedown') {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
    } else if (e.type === 'mousemove') {
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveChanges = async () => {
    if (note && onUpdateNote && editableRef.current) {
      const newContent = editableRef.current.innerHTML;
      await onUpdateNote(note.id, { content: newContent });
    }
    onClose();
  };

  if (!isOpen || !note) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl border border-slate-200/50 w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {note.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold">
                {category}
              </span>
              <Clock className="w-4 h-4" />
              <time>{new Date(note.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}</time>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveChanges} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg">
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all group ml-2"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-500 group-hover:text-slate-900" />
            </button>
          </div>
        </div>

        {/* Pro Fields Panel */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/70 to-blue-50/70">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Priority</label>
              <select 
                value={note?.priority || 'medium'} 
                onChange={(e) => {
                  if (onUpdateNote && note) {
                    onUpdateNote(note.id, { priority: e.target.value as 'low' | 'medium' | 'high' });
                  }
                }}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 ring-blue-500 focus:border-blue-500 text-sm font-semibold bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={note?.pinned || false}
                  onChange={(e) => {
                    if (onUpdateNote && note) {
                      onUpdateNote(note.id, { pinned: e.target.checked });
                    }
                  }}
                  className="w-4 h-4 rounded focus:ring-2 ring-blue-500"
                />
                Pinned
              </label>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Tags</label>
              <div className="flex flex-wrap gap-1">
                {(note?.tags || []).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        {!isPreview && (
          <div className="flex flex-wrap gap-1 sm:gap-2 p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <button type="button" className="p-2 sm:p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => formatText('bold')} title="Bold (Ctrl+B)">
              <Bold className="w-4 h-4" /> <span className="hidden sm:inline">B</span>
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => formatText('italic')} title="Italic (Ctrl+I)">
              <Italic className="w-4 h-4" /> <span className="hidden sm:inline">I</span>
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('formatBlock', 'h1')} title="عنوان رئيسي">
              <Type className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('formatBlock', 'h2')} title="عنوان جانبي">
              <Type className="w-4 h-4 scale-75" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertHorizontalRule')} title="خط فاصل">
              <SeparatorHorizontal className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => formatText('underline')} title="Underline">
              <Underline className="w-4 h-4" /> <span className="hidden sm:inline">U</span>
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => {
              const tableHtml = '<table border="1" style="border-collapse: collapse;"><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>';
              formatText('insertHTML', tableHtml);
            }} title="جدول">
              <Table className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('strikeThrough')} title="Strikethrough">
              <Strikethrough className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
              <List className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertOrderedList')} title="Numbered List">
              <List className="w-4 h-4 rotate-180" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => {
              const url = prompt('Enter URL:');
              if (url) formatText('createLink', url);
            }} title="Link">
              <Link2 className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertHTML', '<code></code>')} title="Code">
              <Code className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('formatBlock', 'blockquote')} title="Quote">
              <Quote className="w-4 h-4" />
            </button>
            {/* Undo/Redo */}
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('undo')} title="Undo">
              <Undo className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('redo')} title="Redo">
              <Redo className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-blue-200 mx-2 hidden sm:block" />
            {/* Drawing */}
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => setIsDrawing(!isDrawing)} title="Toggle Drawing">
              <PenTool className="w-4 h-4" />
            </button>
            {isDrawing && (
              <div className="flex items-center gap-1 p-2 bg-white rounded-xl border shadow-sm">
                <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
                <button onClick={clearCanvas} className="p-1 hover:bg-slate-200 rounded-lg" title="Clear">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {/* Preview */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border ml-auto">
              <button type="button" className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setIsPreview(!isPreview)} title="Toggle Preview">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Pro Fields Panel */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/70 to-blue-50/70">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Priority</label>
              <select 
                value={note?.priority || 'medium'} 
                onChange={(e) => {
                  if (onUpdateNote && note) {
                    onUpdateNote(note.id, { priority: e.target.value as 'low' | 'medium' | 'high' });
                  }
                }}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 ring-blue-500 focus:border-blue-500 text-sm font-semibold bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={note?.pinned || false}
                  onChange={(e) => {
                    if (onUpdateNote && note) {
                      onUpdateNote(note.id, { pinned: e.target.checked });
                    }
                  }}
                  className="w-4 h-4 rounded focus:ring-2 ring-blue-500"
                />
                Pinned
              </label>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Tags</label>
              <div className="flex flex-wrap gap-1">
                {(note?.tags || []).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 p-6 sm:p-8 overflow-y-auto">
          {!isPreview ? (
            <>
              <div contentEditable 
                   ref={editableRef} 
                   suppressContentEditableWarning={true}
                   className="prose prose-slate max-w-none mb-8 leading-relaxed min-h-[200px] outline-none focus:outline-none p-4 border border-slate-200 rounded-xl bg-slate-50/50"
                   dir="auto"
                   onInput={(e) => setContent(e.currentTarget.innerHTML)}
                   dangerouslySetInnerHTML={{ __html: content }}
              />
              {isDrawing && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <canvas 
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full max-w-md mx-auto block border rounded-xl shadow-lg cursor-crosshair"
                    onMouseDown={handleDrawing}
                    onMouseMove={handleDrawing}
                    onMouseUp={() => ctxRef.current?.closePath()}
                    onMouseLeave={() => ctxRef.current?.closePath()}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="prose prose-slate max-w-none mb-8 leading-relaxed p-4 border border-slate-200 rounded-xl bg-white shadow-inner" 
                 dangerouslySetInnerHTML={{ __html: content }} 
                 dir="auto" />
          )}

          {/* Media */}
          {note.image && (
            <div className="my-6 rounded-2xl overflow-hidden border shadow-lg">
              <img 
                src={note.image} 
                alt="Note attachment"
                className="w-full h-64 sm:h-80 md:h-96 object-contain bg-slate-50"
                onError={(e) => {
                  console.warn('Image load failed:', note.image);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          {note.video_url && (
            <div className="my-6 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
              <a 
                href={note.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Video className="w-5 h-5" />
                Watch Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
