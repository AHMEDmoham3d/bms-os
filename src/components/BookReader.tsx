import { X, BookOpen, Moon, Sun, Download, Menu, ChevronLeft, ChevronRight, PenTool, Maximize2 } from 'lucide-react';

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

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontFamily, setFontFamily] = useState<'system' | 'serif'>('serif');
  const [fontSize, setFontSize] = useState(18);
  const [showTOC, setShowTOC] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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
        case 'm':
        case 'M':
          setIsMaximized(!isMaximized);
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrevNote, onNextNote, onClose, isMaximized]);

  const bookTheme = {
    light: 'bg-gradient-to-b from-white via-slate-50/95 to-slate-50',
    dark: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
  } as const;

  const textColor = {
    light: 'text-slate-900/98',
    dark: 'text-slate-100/98'
  } as const;

  const fontClass = fontFamily === 'serif' 
    ? 'font-serif leading-[1.8] tracking-tight antialiased' 
    : 'font-[Inter,-apple-system,system-ui,sans-serif] leading-[1.75] tracking-normal antialiased';

  const getTOC = () => {
    const headings = note.content?.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi) || [];
    return headings.slice(0, 12).map((h, i) => ({
      id: `toc-${i}`,
      title: h.replace(/<[^>]*>/g, '').trim().substring(0, 60) + (h.replace(/<[^>]*>/g, '').trim().length > 60 ? '...' : '')
    }));
  };

  const exportPDF = () => {
    // Professional PDF export stub - can integrate jsPDF or html2pdf later
    const content = contentRef.current?.innerHTML || '';
    console.log('Exporting PDF:', note.title, content);
    alert(`PDF Export: "${note.title}"\n\nReady for integration with jsPDF/html2pdf`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Book Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              w-full max-w-[95vw] md:max-w-6xl h-[90vh] sm:h-[92vh] lg:h-[95vh] 
              flex flex-col rounded-3xl shadow-2xl overflow-hidden relative border
              border-slate-200/50 dark:border-slate-700/50
              bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
              ${isMaximized ? 'max-w-screen-xl h-screen m-0 rounded-none border-0 shadow-none' : ''}
            `}
          >
            {/* Enhanced Header */}
            <div className="p-6 lg:p-8 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/90 dark:from-slate-800/90 dark:via-slate-900/95 dark:to-slate-800/90 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 shadow-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button 
                  onClick={onClose} 
                  className="p-3 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-2xl transition-all hover:scale-105 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                      {note.title}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Chapter {currentIndex + 1} of {categoryNotes.length}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Professional Controls - Responsive */}
              <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 lg:py-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2.5 hover:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl transition-all hover:scale-105 text-emerald-700 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    title="Edit Note"
                    aria-label="Edit"
                  >
                    <PenTool className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  className="p-2.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-all hover:scale-105"
                  title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
                  aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2 p-1.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 px-2">Aa</label>
                  <select
                    value={fontFamily}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFontFamily(e.target.value as 'system' | 'serif')}
                    className="text-xs bg-transparent border-0 p-1 focus:ring-1 focus:ring-slate-400 rounded focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="serif">Serif</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
                  <input
                    type="range"
                    min="16"
                    max="32"
                    step="2"
                    value={fontSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFontSize(Number(e.target.value))}
                    className="w-20 h-2 accent-slate-500 bg-slate-200/50 dark:bg-slate-700/50 rounded-full appearance-none cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 w-10 text-center flex-shrink-0">
                    {fontSize}px
                  </span>
                </div>
                <button
                  onClick={() => setShowTOC(!showTOC)}
                  className="p-2.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-all hover:scale-105"
                  title="Table of Contents"
                  aria-label="Toggle Table of Contents"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-all hover:scale-105 hidden lg:block"
                  title="Toggle Fullscreen"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Clean Progress Bar */}
            <div className="h-1.5 bg-slate-200/50 dark:bg-slate-700/50 shadow-inner relative overflow-hidden flex-shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* TOC Sidebar - Professional */}
              <AnimatePresence>
                {showTOC && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 'min(360px, 30%)' }}
                    exit={{ width: 0 }}
                    className="bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6 overflow-auto flex-shrink-0"
                  >
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 flex items-center gap-2">
                      📋 Table of Contents
                    </h3>
                    <nav className="space-y-1">
                      {getTOC().map((item, i) => (
                        <a 
                          key={item.id}
                          href={`#${item.id}`} 
                          className="block py-3 px-4 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-all font-medium text-sm"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="font-mono text-xs opacity-75 mr-3">{String(i+1).padStart(2, '0')}.</span>
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Professional Content Area */}
              <div 
                ref={containerRef}
                className={`
                  flex-1 overflow-auto p-8 sm:p-10 lg:p-12 xl:p-16
                  ${bookTheme[theme]} ${textColor[theme]} ${fontClass}
                  prose prose-lg sm:prose-xl lg:prose-2xl xl:prose-3xl prose-headings:font-bold 
                  prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                  prose-a:no-underline prose-a:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-700
                  dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
                  prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:rounded-r-xl
                  max-w-none mx-auto
                  prose-p:mb-8 sm:mb-10 prose-h1:mb-12 prose-h2:mb-10 prose-h3:mb-8 lg:prose-p:mb-12 lg:prose-h1:mb-16 lg:prose-h2:mb-12
                  prose-ul:my-8 prose-ol:my-8 prose-li:mb-2 prose-li:text-base sm:text-lg
                  before:content-none after:content-none
                  [font-size:${fontSize}px]
                  focus:outline-none
                `}
                dir="auto"
              >
                <div 
                  ref={contentRef}
                  className="prose prose-lg sm:prose-xl lg:prose-2xl xl:prose-3xl max-w-5xl mx-auto prose-headings:font-bold prose-headings:leading-tight"
                  dangerouslySetInnerHTML={{ 
                    __html: note.content || `
                      <div class="text-center py-20 px-4 sm:py-32">
                        <div class="w-24 h-24 mx-auto mb-8 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                          <BookOpen class="w-12 h-12 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-500 dark:text-slate-400 mb-6">
                          No content yet
                        </h2>
                        <p class="text-xl sm:text-2xl text-slate-400 dark:text-slate-500 max-w-2xl mx-auto mb-8 font-medium">
                          Click <span class="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-xl font-semibold border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm inline-block mx-1">Edit</span> to create your first note.
                        </p>
                      </div>
                    ` 
                  }} 
                />
                
                {/* Subtle Reading Enhancements */}
                {!showTOC && (
                  <>
                    <div className="absolute top-4 right-4 w-48 h-full bg-gradient-to-b from-transparent via-white/70 dark:via-slate-900/70 to-transparent pointer-events-none z-10 hidden lg:block" />
                    <div className="absolute bottom-4 left-4 w-full h-48 bg-gradient-to-t from-white/60 dark:from-slate-900/60 via-transparent to-transparent pointer-events-none z-10" />
                  </>
                )}
              </div>
            </div>

            {/* Navigation Footer */}
            {(hasPrev || hasNext) && (
              <div className="p-6 lg:p-8 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/90 dark:from-slate-800/90 dark:via-slate-900/95 dark:to-slate-800/90 border-t border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center justify-between gap-4">
                <motion.button
                  onClick={onPrevNote}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!hasPrev}
                  className="group flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-sm transition-all font-semibold text-sm lg:text-base"
                >
                  <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </motion.button>
                
                <div className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 px-6 py-2.5 lg:py-3 rounded-2xl backdrop-blur border border-slate-200/50 dark:border-slate-700/50 shadow-md">
                  Chapter {currentIndex + 1} • {categoryNotes.length}
                </div>
                
                <motion.button
                  onClick={onNextNote}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!hasNext}
                  className="group flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-sm transition-all font-semibold text-sm lg:text-base"
                >
                  Next
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}

            {/* Fixed Export Button */}
            {!isMaximized && (
              <motion.button
                onClick={exportPDF}
                className="absolute top-6 right-6 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-emerald-400/50 lg:bottom-auto z-20 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Export as PDF"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold text-sm hidden sm:inline">Export PDF</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

