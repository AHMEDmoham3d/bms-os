import { X, BookOpen, Moon, Sun, Download, Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import type { Note } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface BookReaderProps {
  note: Note;
  notes: Note[];
  categoryId: number;
  isOpen: boolean;
  onClose: () => void;
  onNextNote: () => void;
  onPrevNote: () => void;
}

export default function BookReader({ 
  note, 
  notes, 
  categoryId, 
  isOpen, 
  onClose, 
  onNextNote, 
  onPrevNote 
}: BookReaderProps) {
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState(16);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTOC, setShowTOC] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find current note index
  const currentIndex = notes.findIndex(n => n.id === note.id);
  const categoryNotes = notes.filter(n => n.category_id === categoryId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < categoryNotes.length - 1;

  // Auto-scroll progress tracking
  useEffect(() => {
    const updateProgress = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateProgress);
      return () => container.removeEventListener('scroll', updateProgress);
    }
  }, [note]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch(e.key) {
        case 'ArrowLeft':
          if (hasPrev) onPrevNote();
          break;
        case 'ArrowRight':
          if (hasNext) onNextNote();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrevNote, onNextNote, onClose]);

  const bookTheme = {
    day: 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGFwZXIiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEiIGZpbGw9IiNmNWY1ZjUiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEiIGZpbGw9IiNmNWY1ZjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGFwZXIpIi8+PC9zdmc+")] bg-center bg-repeat',
    night: 'bg-gradient-to-b from-slate-900 to-slate-950'
  } as const;

  const getTOC = () => {
    const headings = note.content?.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi) || [];


    return headings.slice(0, 10).map((h, i) => ({
      id: `toc-${i}`,
      title: h.replace(/<[^>]*>/g, '').trim().substring(0, 50) + '...'
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Book Container */}
          <motion.div
            initial={{ scale: 0.9, rotateX: 90 }}
            animate={{ scale: 1, rotateX: 0 }}
            exit={{ scale: 0.9, rotateX: 90 }}
            className="w-full max-w-4xl h-[90vh] max-h-[90vh] flex flex-col bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Book Header */}
            <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-serif font-black text-slate-900">{note.title}</h2>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(t => t === 'day' ? 'night' : 'day')}
                  className="p-2 hover:bg-slate-200 rounded-xl"
                  title="Toggle Theme"
                >
                  {theme === 'day' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                
                {/* Font Toggle */}
                <select
                  value={fontFamily}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFontFamily(e.target.value as 'serif' | 'sans')}
                  className="p-2 border border-slate-200 rounded-xl focus:ring-2 ring-amber-500 bg-white"
                >
                  <option value="serif">Serif</option>
                  <option value="sans">Sans</option>
                </select>

                {/* Font Size */}
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFontSize(Number(e.target.value))}
                  className="w-24 h-2 bg-slate-200 rounded-lg accent-amber-500"
                />
                <span className="text-sm font-mono text-slate-600">{fontSize}px</span>

                {/* TOC */}
                <button
                  onClick={() => setShowTOC(!showTOC)}
                  className="p-2 hover:bg-slate-200 rounded-xl"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="flex items-center bg-white rounded-xl border px-3 py-1 shadow-sm">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Find in book..."
                    className="outline-none text-sm w-32"
                  />
                </div>

                {/* Export */}
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Download className="w-4 h-4 inline mr-1" />
                  PDF
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-200/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 shadow-inner"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* TOC Sidebar */}
            <AnimatePresence>
              {showTOC && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 p-4 max-h-[calc(90vh-140px)] overflow-auto"
                >
                  <h3 className="font-serif font-bold text-lg mb-4">Table of Contents</h3>
                  <ul className="space-y-2">
                    {getTOC().map((item, i) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="block p-2 hover:bg-amber-100 rounded text-sm font-medium text-slate-700 hover:text-amber-700 transition-all">
                          {i+1}. {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Book Content */}
            <div 
              ref={containerRef}
              className={`
                flex-1 overflow-auto p-12 sm:p-16 lg:p-20 xl:p-24
                ${bookTheme[theme]} ${fontFamily === 'serif' ? 'font-serif' : 'font-[Cairo]'}
                text-slate-900 ${theme === 'night' ? 'text-slate-100' : ''}
                prose prose-slate prose-headings:font-serif prose-headings:text-slate-900
                prose-headings:font-black prose-a:text-amber-600 hover:prose-a:underline
                leading-8 lg:leading-10 tracking-wide
                max-w-5xl mx-auto
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b 
                before:from-transparent before:to-slate-200/50 before:blur before:pointer-events-none
                ${theme === 'night' ? 'before:to-slate-900/30' : ''}
                [font-size:${fontSize}px]
              `}
              dir="auto"
            >
              <div 
                ref={contentRef}
                className="prose prose-2xl lg:prose-3xl max-w-none relative"
                dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-slate-500 italic py-20 text-center">No content yet</p>' }} 
              />
              
              {/* Page Shadows */}
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-b from-transparent to-slate-900/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
            </div>

            {/* Navigation Footer */}
            {(hasPrev || hasNext) && (
              <div className="p-6 border-t border-slate-200/50 bg-gradient-to-t from-slate-50 to-transparent flex items-center justify-between">
                <motion.button
                  onClick={onPrevNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>
                
                <div className="text-sm text-slate-500">
                  Page {currentIndex + 1} of {categoryNotes.length}
                </div>
                
                <motion.button
                  onClick={onNextNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
