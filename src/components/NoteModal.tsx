import { useEffect } from 'react';
import { X, Video } from 'lucide-react';
import type { Note } from '../lib/types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export default function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
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

  if (!isOpen || !note) return null;

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
        <div className="p-6 sm:p-8 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {note.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-500 group-hover:text-slate-900" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 p-6 sm:p-8 overflow-y-auto">
          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
              Category Placeholder {/* Will be passed or fetched */}
            </span>
            <div className="text-sm text-slate-500">
              <span>Created: </span>
              <time>{new Date(note.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}</time>
            </div>
          </div>

          {/* Full Content */}
          {note.content && (
            <div 
              className="prose prose-slate max-w-none mb-8 leading-relaxed"
              dir="auto"
            >
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>
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

