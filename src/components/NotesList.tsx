import type { Note, Category } from '../lib/types';
import { useState } from 'react';
import { Clock, Video, Plus } from 'lucide-react';
import NoteActions from './NoteActions';
import NoteForm from './NoteForm';


interface NotesListProps {
  notes: Note[];
  categories: Category[];
  selectedCategory: Category;
  selectedNote: Note | null;
  onSelectNote: (note: Note | null) => void;
  onDeleteNote: (id: number) => void;
  onUpdateNote: (noteId: number, updates: Partial<Note>) => void;
  onNoteAdded: () => void;
}

export default function NotesList({ notes, categories, selectedCategory, onSelectNote, onDeleteNote, onUpdateNote, onNoteAdded }: NotesListProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  if (notes.length === 0) {
    return (
      <div className="col-span-full text-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-300">
        <Clock className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400 mx-auto mb-6 sm:mb-8 animate-pulse" />
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 sm:mb-3">No notes yet</h3>
        <p className="text-lg sm:text-xl text-slate-500 max-w-md mx-auto leading-relaxed">Your first note will appear here. Start capturing your thoughts now.</p>
      </div>
    );
  }

  if (expandedNoteId === 0) {
    return (
      <NoteForm 
        selectedCategory={selectedCategory}
        onNoteAdded={onNoteAdded}
        editingNote={undefined}
        onClose={() => setExpandedNoteId(null)}
        inline={true}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto px-2 sm:px-4">
      {expandedNoteId !== 0 && (
        <button 
          onClick={() => setExpandedNoteId(0)} 
          className="group flex items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-slate-900 text-white rounded-3xl font-black text-base sm:text-lg shadow-2xl hover:shadow-slate-900/50 hover:-translate-y-1 transition-all border border-slate-800 w-full text-left"
        >
          <Plus className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span>New Note</span>
        </button>
      )}
      {notes.map((note, index) => {
        const category = categories.find(c => c.id === note.category_id);
        const timeAgo = new Date(note.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <article 
            key={note.id} 
            className={`cursor-pointer group overflow-hidden bg-gradient-to-b from-white/95 to-slate-50/80 backdrop-blur-xl border border-slate-200/50 shadow-xl hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-500 rounded-3xl ${note.id === expandedNoteId ? 'ring-4 ring-slate-400/50 scale-105 shadow-2xl border-slate-300' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNote(note.id === expandedNoteId ? null : note);
              setExpandedNoteId(note.id === expandedNoteId ? null : note.id);
            }}
          >

            {/* Blog Header: Category Tag + Date */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  {category?.name || 'General'}
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <time>{timeAgo}</time>
                </div>
                <NoteActions note={note} onUpdateNote={onUpdateNote} onDeleteNote={onDeleteNote} />
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-2 sm:mb-3 leading-tight">{note.title}</h3>
              <div 
                className="text-sm sm:text-base text-slate-700 leading-relaxed line-clamp-3 prose prose-sm max-w-none max-h-20 sm:max-h-24 overflow-hidden prose-headings:text-slate-900 prose-headings:font-bold [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-2" 
                dir="auto"
                dangerouslySetInnerHTML={{ __html: note.content }} 
              />
            </div>



            {/* Media */}
            {note.image && (
              <div className="my-4 rounded-xl overflow-hidden border shadow-sm">
                <img 
                  src={note.image} 
                  alt="Note image" 
                  className="w-full h-32 sm:h-48 object-cover"
                  onError={(e) => {
                    console.warn('Image 404:', note.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {note.video_url && (
              <div className="my-4 aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-100 flex items-center justify-center">
                <a 
                  href={note.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  onClick={(e) => {
                    // Test if URL is valid (basic check)
                    if (!note.video_url?.startsWith('http')) {
                      e.preventDefault();
                      console.warn('Invalid video URL:', note.video_url);
                      alert('Invalid video URL');
                    }
                  }}
                >
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">Watch Video</span>
                </a>
              </div>
            )}


          </article>
        );
      })}
    </div>
  );
}

