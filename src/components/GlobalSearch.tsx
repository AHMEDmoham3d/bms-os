import { useState, useEffect, KeyboardEvent } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import type { Note } from '../lib/types';
import { useNotesData } from '../lib/useNotesData';
import { sectors } from '../data/company';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: Note) => void;
}

export default function GlobalSearch({ isOpen, onClose, onSelectNote }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { notesByCategory, categories, loading } = useNotesData();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const allNotes: Note[] = [];
    Object.values(notesByCategory).forEach((notes: Note[]) => {
      allNotes.push(...notes);
    });

    const lowerQuery = query.toLowerCase();

    const noteMatches = allNotes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    const categoryMatches = categories.filter(cat => 
      cat.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    const sectorMatches = sectors.filter(sector => 
      sector.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    setResults([
      ...noteMatches.map(n => ({ type: 'note', item: n })),
      ...categoryMatches.map(c => ({ type: 'category', item: c })),
      ...sectorMatches.map(s => ({ type: 'sector', item: s })),
    ]);
  }, [query, notesByCategory, categories]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
    } else if (e.key === 'Enter' && results[0]) {
      const first = results[0];
      if (first.type === 'note') onSelectNote(first.item);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center gap-4">
          <Search className="w-6 h-6 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, categories, sectors... (Cmd+K)"
            className="w-full text-xl font-bold text-slate-900 bg-transparent border-none outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl ml-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-slate-500 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </div>
          )}
          {query && !loading && results.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No results found for "{query}"
            </div>
          )}
          {results.map((result) => (
            <button
              key={`${result.type}-${result.item.id}`}
              className="w-full p-6 hover:bg-slate-50 text-left first:rounded-t-xl last:rounded-b-xl group transition-all"
              onClick={() => {
                if (result.type === 'note') onSelectNote(result.item);
                onClose();
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900/10 to-blue-900/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-lg font-black text-slate-800">
                    {result.item.title?.slice(0,1).toUpperCase() || result.item.name?.slice(0,1).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-600">
                    {result.type === 'note' ? result.item.title : result.item.name}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {result.type === 'note' ? result.item.content.slice(0, 100) + '...' : `${result.item.description?.slice(0, 80)}...`}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-full font-medium">
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                    </span>
                    {result.type === 'note' && (
                      <span>{new Date(result.item.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

