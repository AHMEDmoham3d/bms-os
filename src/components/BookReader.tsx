import { X, BookOpen, Moon, Sun, Download, Menu, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';

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

  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState(16);
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
    day: 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZkZmNmYyIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhaW4pIi8+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyYWluIiB3aWR0aD0iMTUyIiBoZWlnaHQ9IjEwNCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMTAiIHk9IjEwIj48cGF0aCBkPSJNMCw4QzAsNiw0LDYsOCw4czgtMiw4LDJjMCwyLTQsMiw4LDJzOCwwLDgsMnMtNCw2LDAsNnMtOCwyLTgsMnMtOC0yLTgtMnMtNC02LDAsNnptMTYsMDFjMC0xLDQtMSw4LDFzOCwwLDgsMXMtNCwxLDAsMXMtOCwwLTgtMXMtOC0xLTgtMXoiIGZpbGw9InJnYmEoMCwwLDAsLjA1KSIgb3BhY2l0eT0iLjAyNSIvPjwvcGF0dGVybj48L2RlZnM+PC9zdmc+")] bg-[length:64px_64px] bg-repeat bg-center',
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-lg"
          onClick={onClose}
        >
          {/* Book Container */}
          <motion.div
            initial={{ scale: 0.9, rotateX: 90 }}
            animate={{ scale: 1, rotateX: 0 }}
            exit={{ scale: 0.9, rotateX: 90 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl h-[92vh] flex flex-col bg-gradient-to-b from-amber-50 via-slate-50/90 to-amber-100 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] border border-amber-300/50 shadow-amber-400/20 overflow-hidden relative"
          >
            {/* Book Header - Leather Spine */}
            <div className="p-8 bg-gradient-to-r from-amber-900/95 via-amber-800 to-amber-900 text-amber-50 shadow-[inset_0_2px_6px_rgba(255,215,128,0.2),inset_0_-4px_12px_rgba(0,0,0,0.4)] border-b-4 border-amber-400/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-3 hover:bg-amber-700/60 backdrop-blur-sm rounded-2xl shadow-lg transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <X className="w-6 h-6 drop-shadow-lg" />
                </button>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 [filter:drop-shadow(0_2px_4px_rgba(255,215,0,0.8))] shadow-lg" />
                  <h2 className="text-4xl lg:text-5xl font-serif font-black [text-shadow:3px_3px_6px_rgba(0,0,0,0.7),0_0_8px_rgba(255,215,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.6)] leading-tight tracking-tight drop-shadow-2xl">{note.title}</h2>
                </div>
              </div>
              
              {/* Controls Ribbon */}
              <div className="flex items-center gap-2 bg-amber-700/40 backdrop-blur-md px-4 py-2 rounded-3xl border-2 border-amber-500/40 shadow-xl">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 hover:bg-emerald-400/30 rounded-2xl transition-all hover:scale-105"
                    title="Edit Note"
                  >
                    <PenTool className="w-5 h-5 text-emerald-300 drop-shadow-sm" />
                  </button>
                )}
                <button
                  onClick={() => setTheme(t => t === 'day' ? 'night' : 'day')}
                  className="p-2 hover:bg-slate-200/20 rounded-2xl transition-all hover:scale-105"
                  title="Toggle Theme"
                >
                  {theme === 'day' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <select
                  value={fontFamily}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFontFamily(e.target.value as 'serif' | 'sans')}
                  className="p-1.5 bg-amber-50/70 border border-amber-400/60 rounded-xl text-sm focus:ring-2 ring-amber-400 font-semibold text-slate-900"
                >
                  <option value="serif">Serif</option>
                  <option value="sans">Sans</option>
                </select>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFontSize(Number(e.target.value))}
                  className="w-24 h-2 accent-amber-500 bg-amber-400/40 rounded-full appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-amber-200 w-10 text-center">{fontSize}px</span>
                <button
                  onClick={() => setShowTOC(!showTOC)}
                  className="p-2 hover:bg-slate-200/20 rounded-2xl transition-all hover:scale-105"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Export Button */}
              <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-[0_10px_25px_rgba(251,191,36,0.5)] hover:-translate-y-1 transition-all active:scale-95">
                <Download className="w-5 h-5 inline mr-2" />
                Export PDF
              </button>
            </div>

            {/* Progress Ribbon */}
            <div className="h-5 bg-gradient-to-r from-slate-300/60 via-amber-200/80 to-slate-300/60 shadow-inner relative overflow-hidden">
              <div 
                className="absolute inset-0 h-full bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 shadow-[0_4px_12px_rgba(239,68,68,0.5)] rounded-t-xl transition-all duration-1000 hover:scale-[1.02] before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:w-10 before:h-6 before:bg-gradient-to-t before:from-transparent before:to-red-400/70 before:rotate-[10deg] before:shadow-lg before:pointer-events-none"
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
                  className="w-80 bg-gradient-to-r from-amber-50/95 to-slate-50/95 backdrop-blur-xl border-r-4 border-amber-200/70 shadow-2xl p-6 max-h-[calc(92vh-200px)] overflow-auto"
                >
                  <h3 className="font-serif font-black text-2xl mb-6 text-slate-900 border-b-2 border-amber-300 pb-3 drop-shadow-md">Table of Contents</h3>
                  <ul className="space-y-2">
                    {getTOC().map((item, i) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="block p-3 rounded-2xl text-slate-800 font-semibold hover:bg-gradient-to-r hover:from-amber-200 hover:to-orange-200 hover:text-amber-900 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
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
                flex-1 overflow-auto p-8 lg:p-12 [box-shadow:inset_40px_0_80px_rgba(0,0,0,0.08),inset_-40px_0_80px_rgba(0,0,0,0.08)]
                ${bookTheme[theme]} ${fontFamily === 'serif' ? 'font-serif leading-[1.85] tracking-wide text-slate-800/98 antialiased' : 'font-[Cairo] leading-[1.75] tracking-normal text-slate-800/95 antialiased'}
                prose prose-2xl lg:prose-3xl prose-slate prose-headings:font-serif prose-headings:font-black prose-headings:text-slate-900 prose-headings:shadow-[0_2px_8px_rgba(0,0,0,0.15)] prose-headings:[text-shadow:2px_2px_4px_rgba(0,0,0,0.2)] prose-a:text-amber-700 prose-a:font-bold hover:prose-a:text-amber-800 prose-strong:font-black prose-strong:text-slate-950 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50/80 prose-blockquote:p-6 prose-blockquote:rounded-2xl max-w-none mx-auto
                prose-p:mb-10 prose-h1:mb-20 prose-h2:mb-16 prose-h3:mb-12 prose-ul:my-12 prose-ol:my-12 prose-li:text-xl
                before:content-none after:content-none
                [font-size:${fontSize}px] [line-height:1.8]
              `}
              dir="auto"
            >
              <div 
                ref={contentRef}
                className="prose prose-2xl lg:prose-3xl max-w-5xl mx-auto relative prose-headings:text-5xl lg:prose-headings:text-6xl prose-h2:text-4xl prose-h3:text-3xl prose-p:text-xl lg:prose-p:text-2xl prose-strong:font-serif prose-strong:font-black prose-strong:tracking-wide [&>p]:mb-12 [&>h1]:mb-24 [&>h1+h2]:mt-16 [&>ul,&>ol]:mb-16 [&>blockquote]:mb-16 prose-hr:border-amber-300 prose-hr:h-px prose-hr:shadow-inner"
                dangerouslySetInnerHTML={{ __html: note.content || '<div class="text-center py-32"><p class="text-slate-500/70 italic text-3xl lg:text-4xl font-serif leading-relaxed max-w-3xl mx-auto mb-8 drop-shadow-sm">📖 No content yet.</p><p class="text-xl text-slate-600 font-medium">Tap <span class="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-semibold shadow-md">Edit</span> to begin your reading journey.</p></div>' }} 
              />
              
              {/* Enhanced Page Effects */}
              <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-slate-900/25 via-slate-900/10 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_20%_30%_at_20%_80%,rgba(255,215,0,0.03)_0%,transparent_50%)] pointer-events-none opacity-80" />
            </div>

            {/* Navigation Footer - Book Binding */}
            {(hasPrev || hasNext) && (
              <div className="p-8 bg-gradient-to-r from-amber-900/95 to-amber-800 text-amber-50 font-serif font-bold border-t-8 border-amber-500/70 shadow-[inset_0_-6px_16px_rgba(0,0,0,0.4)] flex items-center justify-between">
                <motion.button
                  onClick={onPrevNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!hasPrev}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-slate-100/95 via-slate-200/90 to-amber-100/80 text-slate-900 hover:from-amber-200/95 hover:via-slate-200 hover:to-amber-300 border-4 border-amber-400/70 rounded-3xl shadow-2xl hover:shadow-[0_12px_30px_rgba(184,134,11,0.5)] hover:-translate-y-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 font-black text-xl"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
                  Previous Chapter
                </motion.button>
                
                <div className="text-2xl font-black drop-shadow-2xl tracking-wider bg-amber-800/50 px-6 py-3 rounded-2xl backdrop-blur-md border border-amber-400/50 shadow-xl">
                  Chapter {currentIndex + 1} • {categoryNotes.length}
                </div>
                
                <motion.button
                  onClick={onNextNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!hasNext}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-slate-100/95 via-slate-200/90 to-amber-100/80 text-slate-900 hover:from-amber-200/95 hover:via-slate-200 hover:to-amber-300 border-4 border-amber-400/70 rounded-3xl shadow-2xl hover:shadow-[0_12px_30px_rgba(184,134,11,0.5)] hover:-translate-y-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 font-black text-xl"
                >
                  Next Chapter
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

