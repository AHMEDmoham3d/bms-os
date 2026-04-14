import { useState } from 'react';
import type { Category } from '../lib/types';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import NoteForm from './NoteForm';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategorySelect: (categoryId: number) => void;
  onNoteAdded: () => void;
  notesByCategory?: Record<number, number>;
}

export default function CategorySelector({ categories, selectedCategoryId, onCategorySelect, onNoteAdded, notesByCategory = {} }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState<number | null>(null);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const getNoteCount = (categoryId: number) => notesByCategory[categoryId] || 0;

  const handleAddNote = (categoryId: number) => {
    onCategorySelect(categoryId);
    setShowAddForm(categoryId);
  };

  const categoryForForm = categories.find(c => c.id === showAddForm!) || selectedCategory!;

  return (
<div className="w-full animate-fadeInUp">
      {/* Mobile Dropdown */}
      <div className="md:hidden relative max-w-md mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group w-full p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:border-slate-400 focus:ring-4 ring-slate-900/20 focus:outline-none transition-all duration-300 hover:-translate-y-1 will-change-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-slate-900">
              {selectedCategory ? selectedCategory.name : 'Select category...'}
            </span>
            <div className="flex items-center gap-2 p-2 bg-slate-900/5 rounded-xl group-hover:bg-slate-900/10 transition-all">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" />
              )}
            </div>
          </div>
        </button>

{isOpen && (
          <div className="absolute w-full mt-2 bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-3xl shadow-2xl z-20 max-h-80 overflow-hidden animate-slideDown">
            <div className="py-4">
              {categories.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500 animate-fadeInUp">
                  No categories yet. Create in Supabase dashboard.
                </div>
              ) : (
                categories.map((category, index) => (
                  <div key={category.id} className="group relative">
                    <button
                      onClick={() => {
                        onCategorySelect(category.id);
                        setIsOpen(false);
                      }}
                      className="w-full px-6 py-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 focus:bg-slate-50/80 transition-all duration-200 flex items-center gap-4 animate-slideInLeft [--delay:calc(0.1s_*_var(--i))] group/item data-[index={index}]"
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      <div className="w-12 h-12 bg-slate-900/10 rounded-xl flex items-center justify-center group-hover:bg-slate-900/20 transition-all flex-shrink-0">
                        <span className="text-lg font-black text-slate-800">
                          {category.name.slice(0,1).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-black text-lg text-slate-900 block">{category.name}</span>
                        <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                          {getNoteCount(category.id)} {getNoteCount(category.id) === 1 ? 'note' : 'notes'}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNote(category.id);
                        setIsOpen(false);
                      }}
                      className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all group-hover:scale-110"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-10 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Desktop Grid Chips - Smart Staggered */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 justify-evenly max-w-6xl mx-auto pb-12 animate-fadeInUp [--stagger-delay:0.1s]">
        {categories.map((category, index) => {
          const noteCount = getNoteCount(category.id);
          const isActive = category.id === selectedCategoryId;
          return (
            <div 
              key={category.id} 
              className="relative animate-chipStagger group/card" 
              style={{ animationDelay: `calc(var(--stagger-delay) * ${index})` } as React.CSSProperties}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-slate-200/10 opacity-0 data-[active=true]:opacity-100 transition-all duration-600 animate-ripple origin-center" />
              </div>
              <button
                onClick={() => onCategorySelect(category.id)}
                data-active={isActive}
                className={`group flex flex-col items-center p-6 rounded-2xl shadow-xl border-2 relative z-10 transition-all duration-400 hover:shadow-2xl hover:-translate-y-1 hover:scale-102 active:scale-[0.99] flex-shrink-0 w-40 h-36 lg:w-44 lg:h-40 will-change-transform ${
                  isActive 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-600 shadow-2xl ring-2 ring-slate-400/50 ring-offset-1 ring-offset-slate-50 scale-102 animate-execPulse' 
                    : 'bg-white/90 backdrop-blur-sm border-slate-200 hover:border-slate-400 text-slate-900 hover:shadow-slate-200'
                }`}
                aria-label={`Select ${category.name}, ${noteCount} notes`}
                aria-pressed={isActive}
              >
                <div className={`w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center mb-3 transition-all group-hover:scale-110 flex-shrink-0 ${
                  isActive ? 'bg-white/20 backdrop-blur' : 'bg-slate-900/10 group-hover:bg-slate-900/20'
                }`}>
                  <span className={`text-2xl lg:text-3xl font-black ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-800 drop-shadow-md'}`}>
                    {category.name.slice(0,1).toUpperCase()}
                  </span>
                </div>
                <span className="font-bold text-base lg:text-lg leading-snug text-center block hyphens-auto px-2 py-1">
                  {category.name}
                </span>
                <span className={`text-sm lg:text-base font-bold mt-2 px-4 py-1.5 rounded-xl shadow-sm transition-all ${
                  isActive 
                    ? 'bg-white/30 text-white shadow-lg backdrop-blur' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 hover:shadow-md'
                }`}>
                  {noteCount}
                </span>
              </button>
                <button
                onClick={() => handleAddNote(category.id)}
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-subtleFloat w-10 h-10 flex items-center justify-center group-hover/card:scale-105"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <div className="mt-12 animate-fadeInUp">
          <NoteForm 
            selectedCategory={categoryForForm!}
            onNoteAdded={() => {
              onNoteAdded();
              setShowAddForm(null);
            }}
            editingNote={undefined}
            onClose={() => setShowAddForm(null)}
            inline={true}
          />
        </div>
      )}
    </div>
  );
}

