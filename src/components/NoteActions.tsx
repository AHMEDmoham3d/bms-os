import type { Note } from '../lib/types';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NoteActionsProps {
  note: Note;
  onDeleteNote: (noteId: number) => void;
}

export default function NoteActions({ note, onDeleteNote }: NoteActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this note?')) return;
    setLoading(true);
    onDeleteNote(note.id);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-600 disabled:opacity-50"
        title="Delete"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
