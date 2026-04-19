import { useState, useRef, useEffect } from 'react';
import type { Note } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, PenTool, Download, Copy, Printer } from 'lucide-react';

interface BookReaderProps {
  note: Note;
  notes: Note[];
  categoryId: number;
  isOpen: boolean;
  onClose: () => void;
  onNextNote: () => void;
  onPrevNote: () => void;
  onEdit?: () => void;
}

export default function BookReader({ 
  note, 
  notes, 
  categoryId, 
  isOpen, 
  onClose, 
  onNextNote, 
  onPrevNote, 
  onEdit 
}: BookReaderProps) {
  const [fontSize, setFontSize] = useState(24);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = notes.findIndex(n => n.id === note.id);
  const categoryNotes = notes.filter(n => n.category_id === categoryId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < categoryNotes.length - 1;

  const copyToClipboard = async () => {
    const text = note.content?.replace(/<[^>]*>/g, '') || note.title;
    await navigator.clipboard.writeText(text);
  };

  const printNote = () => {
    window.print();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch(e.key) {
        case 'ArrowLeft':
          if (hasPrev) onPrevNote();
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (hasNext) onNextNote();
          e.preventDefault();
          break;
        case 'Escape':
          onClose();
          break;
        case 'p':
        case 'P':
          printNote();
          e.preventDefault();
          break;
        case 'c':
        case 'C':
          copyToClipboard();
          e.preventDefault();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrevNote, onNextNote, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl md:max-w-6xl h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                    {note.title}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Note {currentIndex + 1} of {categoryNotes.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button onClick={onEdit} className="p-2 hover:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400" title="Edit">
                    <PenTool className="w-5 h-5" />
                  </button>
                )}
                <button onClick={copyToClipboard} className="p-2 hover:bg-blue-500/10 rounded-xl text-blue-600" title="Copy">
                  <Copy className="w-5 h-5" />
                </button>
                <button onClick={printNote} className="p-2 hover:bg-gray-500/10 rounded-xl text-gray-600 dark:text-gray-400" title="Print">
                  <Printer className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <input
                    type="range"
                    min="18" max="36" step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 min-w-[3ch] text-center">
                    {fontSize}px
                  </span>
                </div>
                <button onClick={printNote} className="p-2 hover:bg-emerald-500/10 rounded-xl text-emerald-600" title="Download">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div ref={containerRef} className="flex-1 overflow-auto p-8 md:p-12 lg:p-16 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              <div
                ref={contentRef}
                className="prose prose-neutral dark:prose-invert max-w-5xl mx-auto prose-headings:font-bold prose-headings:leading-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-lg lg:leading-[2] [font-size:24px] prose-p:mb-8 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-strong:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-a:no-underline prose-a:font-medium prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 dark:prose-blockquote:border-emerald-500 prose-blockquote:pl-4 md:pl-6 prose-blockquote:rounded-r-lg prose-blockquote:font-medium prose-ul:my-6 prose-ol:my-6 prose-li:mb-2 prose-li:leading-relaxed prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900/80 dark:bg-slate-900 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:border prose-pre:border-slate-800/50 dir=auto [font-size:${fontSize}px]"
                dangerouslySetInnerHTML={{ __html: note.content || '<div class="text-center py-32"><div class="w-24 h-24 mx-auto mb-8 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center"><Tag class="w-12 h-12 text-slate-400" /></div><h2 class="text-4xl font-bold text-slate-500 dark:text-slate-400 mb-4">No content</h2><p class="text-xl text-slate-500 dark:text-slate-400 max-w-md mx-auto">Click edit to add your first note</p></div>' }}
              />
            </div>

            {/* Footer Navigation */}
            {(hasPrev || hasNext) && (
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
                <button
                  onClick={onPrevNote}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-white disabled:hover:bg-transparent rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {currentIndex + 1} / {categoryNotes.length}
                </div>
                <button
                  onClick={onNextNote}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-white disabled:hover:bg-transparent rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
