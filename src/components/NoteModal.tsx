import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotesData } from '../lib/useNotesData';
import BookReader from './BookReader';
import { X, Video, Bold, Italic, Underline, Strikethrough, List, Link2, Code, Quote, Undo, Redo, PenTool, Eye, Clock, Type, SeparatorHorizontal, Table, BookOpen } from 'lucide-react';
import type { Note, Category } from '../lib/types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onUpdateNote?: (noteId: number, updates: Partial<Note>) => Promise<void>;
  categories: Category[];
  allNotes: Note[];
  selectedCategoryId: number;
}

export default function NoteModal({ isOpen, onClose, note, onUpdateNote, categories, allNotes, selectedCategoryId }: NoteModalProps) {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#000000');
  const [category, setCategory] = useState('');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const { getPrevNextNote } = useNotesData();

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      const cat = categories.find(c => c.id === note.category_id);
      setCategory(cat?.name || 'General');
      setCurrentNote(note);
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

  const formatText = useCallback((command: string, value?: string) => {
    if (editableRef.current) {
      document.execCommand(command, false, value);
      editableRef.current.focus();
    }
  }, []);

  const handleDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
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
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  }, []);

  const saveChanges = useCallback(async () => {
    if (note && onUpdateNote && editableRef.current) {
      const newContent = editableRef.current.innerHTML;
      await onUpdateNote(note.id, { content: newContent });
    }
    onClose();
  }, [note, onUpdateNote, onClose]);

  const handleNextNote = useCallback(() => {
    if (currentNote && note) {
      const { next } = getPrevNextNote(selectedCategoryId, note.id);
      if (next) setCurrentNote(next);
    }
  }, [currentNote, note, getPrevNextNote, selectedCategoryId]);

  const handlePrevNote = useCallback(() => {
    if (currentNote && note) {
      const { prev } = getPrevNextNote(selectedCategoryId, note.id);
      if (prev) setCurrentNote(prev);
    }
  }, [currentNote, note, getPrevNextNote, selectedCategoryId]);

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
              {currentNote?.title || note.title}
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
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 ring-blue-500 focus:border-blue-500 text-sm font-semibold bg-white"
                disabled
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                <input 
                  type="checkbox" 
                  checked={note?.pinned || false}
                  className="w-4 h-4 rounded focus:ring-2 ring-blue-500"
                  disabled
                />
                Pinned
              </label>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wide">Tags</label>
              <div className="flex flex-wrap gap-1">
                {(note?.tags || []).map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar - only show in edit mode */}
        {!isPreview && (
          <div className="flex flex-wrap gap-1 sm:gap-2 p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <button type="button" className="p-2 sm:p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => formatText('bold')} title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all flex items-center gap-1" onClick={() => formatText('italic')} title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('formatBlock', 'h1')} title="H1">
              <Type className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('formatBlock', 'h2')} title="H2">
              <Type className="w-4 h-4 scale-75" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertHorizontalRule')} title="Divider">
              <SeparatorHorizontal className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('insertUnorderedList')} title="List">
              <List className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => {
              const url = prompt('Enter URL:');
              if (url) formatText('createLink', url);
            }} title="Link">
              <Link2 className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('undo')} title="Undo">
              <Undo className="w-4 h-4" />
            </button>
            <button type="button" className="p-3 hover:bg-blue-200 rounded-xl transition-all" onClick={() => formatText('redo')} title="Redo">
              <Redo className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border ml-auto">
              <button type="button" className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setIsDrawing(!isDrawing)} title="Drawing">
                <PenTool className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-slate-100 rounded-xl" onClick={() => setIsPreview(!isPreview)} title="Book Mode">
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Edit Area */}
        {!isPreview && (
          <div className="flex-1 min-h-0 p-6 sm:p-8 overflow-y-auto">
            <div 
              contentEditable 
              ref={editableRef} 
              suppressContentEditableWarning={true}
              className="prose prose-slate max-w-none mb-8 leading-relaxed min-h-[400px] outline-none focus:outline-none p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-inner focus:border-blue-500 focus:ring-4 ring-blue-200/50"
              dir="auto"
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {isDrawing && (
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 shadow-lg">
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-64 border-2 border-indigo-300 rounded-2xl shadow-lg cursor-crosshair bg-white"
                  onMouseDown={handleDrawing}
                  onMouseMove={handleDrawing}
                  onMouseUp={() => ctxRef.current?.closePath()}
                  onMouseLeave={() => ctxRef.current?.closePath()}
                />
                <div className="flex gap-3 mt-4 pt-4 border-t border-indigo-200">
                  <button onClick={clearCanvas} className="flex-1 p-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl">
                    Clear Canvas
                  </button>
                  <button onClick={() => {
                    if (ctxRef.current && editableRef.current && canvasRef.current) {
                      const dataUrl = canvasRef.current.toDataURL();
                      document.execCommand('insertImage', false, dataUrl);
                      setContent(editableRef.current.innerHTML);
                      clearCanvas();
                      setIsDrawing(false);
                    }
                  }} className="flex-1 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl">
                    Insert Drawing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Book Reader or Preview */}
        {isPreview && currentNote && (
          <BookReader
            note={currentNote}
            notes={allNotes}
            categoryId={selectedCategoryId}
            isOpen={true}
            onClose={() => setIsPreview(false)}
            onNextNote={handleNextNote}
            onPrevNote={handlePrevNote}
          />
        )}

        {/* Simple Preview Fallback */}
        {isPreview && !currentNote && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="prose prose-slate max-w-none leading-relaxed p-8 border border-slate-200 rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-inner prose-headings:font-black prose-headings:text-slate-900" 
                 dangerouslySetInnerHTML={{ __html: content }} 
                 dir="auto" />
          </div>
        )}

        {/* Media */}
        {(note.image || note.video_url) && !isPreview && (
          <div className="p-6 border-t border-slate-200">
            {note.image && (
              <div className="mb-6 rounded-3xl overflow-hidden border shadow-xl">
                <img 
                  src={note.image} 
                  alt="Note image"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            {note.video_url && (
              <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <a 
                  href={note.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
                >
                  <Video className="w-6 h-6" />
                  Play Video
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

