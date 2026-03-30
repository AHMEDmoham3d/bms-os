import type { Note } from '../lib/types';
import { Loader2, Edit3, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';

interface NoteActionsProps {
  note: Note;
  onUpdateNote: (noteId: number, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: number) => void;
}

export default function NoteActions({ note, onUpdateNote, onDeleteNote }: NoteActionsProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await onUpdateNote(note.id, { title, content });
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this note?')) return;
    setLoading(true);
    onDeleteNote(note.id);
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
      {editing ? (
        <>
          <button 
            onClick={handleSaveEdit} 
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-green-500/20 hover:text-green-600 disabled:opacity-50"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCancelEdit}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 hover:text-gray-600"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg hover:bg-blue-500/20 hover:text-blue-600"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-600 disabled:opacity-50"
            title="Delete"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </>
      )}
    </div>
  );
}
