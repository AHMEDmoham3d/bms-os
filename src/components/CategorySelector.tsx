import { useState } from 'react';
import type { Category } from '../lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategorySelect: (categoryId: number) => void;
  notesByCategory?: Record<number, number>; // categoryId -> note count
}


export default function CategorySelector({ categories, selectedCategoryId, onCategorySelect, notesByCategory = {} }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const getNoteCount = (categoryId: number) => notesByCategory[categoryId] || 0;

  return (
    <div className="w-full">
      {/* Mobile Dropdown (default <md) */}
<div className="md:hidden relative max-w-md mx-auto">
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:border-slate-300 focus:ring-4 focus:ring-slate-900/20 focus:outline-none transition-all duration-300 hover:-translate-y-0.5"
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
        <div className="absolute w-full mt-2 bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl z-20 max-h-80 overflow-auto">
          <div className="py-2">
            {categories.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No categories yet. Create in Supabase dashboard.
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-6 py-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 focus:bg-slate-50 group transition-all flex items-center gap-4 hover:translate-x-2"
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
      </div> {/* Close mobile div */}

      {/* Desktop Grid Chips */}

      <div className="hidden md:flex flex-wrap gap-6 lg:gap-8 justify-evenly max-w-6xl mx-auto pb-12">
        {categories.map((category) => {
          const noteCount = getNoteCount(category.id);
          const isActive = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group flex flex-col items-center p-6 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:scale-105 flex-shrink-0 snap-center w-40 h-36 lg:w-44 lg:h-40 ${
                isActive 
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-slate-900/25 ring-4 ring-slate-400/50 scale-105' 
                  : 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
              }`}
              aria-label={`Select ${category.name}, ${noteCount} notes`}
              aria-pressed={isActive}
            >
              <div className={`w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center mb-3 transition-all group-hover:scale-110 flex-shrink-0 ${
                isActive ? 'bg-white/20' : 'bg-slate-900/10 group-hover:bg-slate-900/20'
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
                  ? 'bg-white/30 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}>
                {noteCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

