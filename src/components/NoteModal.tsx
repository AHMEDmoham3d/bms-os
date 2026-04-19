import { useState, useEffect, useRef } from 'react';
import { X, Clock, Bold, Type } from 'lucide-react';
import type { Note, Category } from '../lib/types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onUpdateNote?: (noteId: number, updates: Partial<Note>) => Promise<void>;
  categories: Category[];
}

export default function NoteModal({ isOpen, onClose, note, onUpdateNote, categories }: NoteModalProps) {
  const [isPreview, setIsPreview] = useState(true);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      const cat = categories.find(c => c.id === note.category_id);
      setCategory(cat?.name || 'General');
    }
  }, [note, categories]);

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
              onClick={() => setIsPreview(!isPreview)} 
              className="p-2 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1"
              title="Edit/Preview Toggle"
            >
              {isPreview ? <Bold className="w-5 h-5" /> : <Type className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-500 hover:text-slate-900" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {isPreview ? (
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <div 
                className="prose prose-slate max-w-none leading-relaxed prose-headings:font-black prose-headings:text-slate-900"
                dangerouslySetInnerHTML={{ __html: content }} 
                dir="auto" 
              />
            </div>
          ) : (
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <div 
                contentEditable 
                ref={editableRef} 
                suppressContentEditableWarning={true}
                className="prose prose-slate max-w-none leading-relaxed min-h-[400px] outline-none focus:outline-none p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-inner focus:border-blue-500 focus:ring-4 ring-blue-200/50"
                dir="auto"
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        {(note.image || note.video_url) && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            {note.image && (
              <div className="mb-6 rounded-3xl overflow-hidden border shadow-lg">
                <img 
                  src={note.image} 
                  alt="Note image"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            {note.video_url && (
              <div className="text-center">
                <a 
                  href={note.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  ▶️ Play Video
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

