import { useState, useMemo } from 'react';
import type { Category } from '../lib/types';
import { Plus, Search, Filter, TrendingUp } from 'lucide-react';
import NoteForm from './NoteForm';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategorySelect: (categoryId: number) => void;
  onNoteAdded: () => void;
  notesByCategory?: Record<number, number>;
}

export default function CategorySelector({ categories, selectedCategoryId, onCategorySelect, onNoteAdded, notesByCategory = {} }: CategorySelectorProps) {
  const [showAddForm, setShowAddForm] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'count'>('count');
  const [filterEmpty, setFilterEmpty] = useState(false);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const totalNotes = Object.values(notesByCategory).reduce((a, b) => a + b, 0);

  const getNoteCount = (categoryId: number) => notesByCategory[categoryId] || 0;

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(cat => 
      cat.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filterEmpty) {
      filtered = filtered.filter(cat => getNoteCount(cat.id) > 0);
    }

    return filtered.sort((a, b) => {
      const countA = getNoteCount(a.id);
      const countB = getNoteCount(b.id);
      
      if (sortBy === 'count') {
        return countB - countA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categories, search, sortBy, filterEmpty, notesByCategory]);

  const getCategoryColor = (name: string) => {
    const colors = ['rose', 'emerald', 'blue', 'orange', 'purple', 'sky', 'lime', 'amber'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleAddNote = (categoryId: number) => {
    onCategorySelect(categoryId);
    setShowAddForm(categoryId);
  };

  const categoryForForm = categories.find(c => c.id === showAddForm!) || selectedCategory!;

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Smart Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-8 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث في الفئات..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 bg-white/80 backdrop-blur shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1.5 bg-white/80 rounded-2xl border shadow-sm">
          <button 
            onClick={() => setSortBy('alpha')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${sortBy === 'alpha' ? 'bg-slate-200 text-slate-800 shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            A-Z
          </button>
          <button 
            onClick={() => setSortBy('count')} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${sortBy === 'count' ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-emerald-100 text-emerald-700'}`}
          >
            عدد <TrendingUp className="w-4 h-4 inline ml-1" />
          </button>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/80 rounded-2xl border cursor-pointer hover:bg-slate-100 transition-all">
          <input 
            type="checkbox" 
            checked={filterEmpty} 
            onChange={(e) => setFilterEmpty(e.target.checked)} 
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 shadow-sm"
          />
          <Filter className="w-4 h-4" /> إخفاء الفارغة
        </label>
      </div>

      {/* Desktop Pro Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-12">
        {filteredCategories.map((category) => {
          const count = getNoteCount(category.id);
          const percentage = totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
          const isActive = category.id === selectedCategoryId;
          const color = getCategoryColor(category.name);
          
          return (
            <div key={category.id} className={`group relative overflow-hidden rounded-3xl shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] hover:border-blue-400/50 ${isActive ? 'ring-4 ring-blue-400/70 scale-105 border-blue-400 shadow-blue-500/25' : 'border-slate-200 hover:border-slate-400'}`}>
              {/* Add Button */}
              <button
                onClick={() => handleAddNote(category.id)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-white shadow-2xl hover:shadow-white/80 rounded-2xl border hover:border-emerald-300 hover:bg-emerald-50 transition-all group-hover:scale-110 backdrop-blur-sm w-12 h-12 flex items-center justify-center"
                title="إضافة نوت"
              >
                <Plus className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </button>
              
              {/* Card */}
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`w-full h-44 p-6 flex flex-col items-center justify-between relative z-10 transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white'
                }`}
                aria-label={`${category.name} - ${count} نوت`}
              >
                {/* Icon */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-2xl ring-2 transition-all group-hover:scale-110 ring-white/50 flex-shrink-0 font-black text-3xl ${
                  isActive 
                    ? 'bg-white/30' 
                    : `bg-gradient-to-r from-${color}-400 to-${color}-500 text-white shadow-${color}-500/25`
                }`}>
                  {category.name.slice(0,1).toUpperCase()}
                </div>
                
                {/* Content */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <h3 className={`font-black text-lg leading-tight px-2 text-center transition-colors ${isActive ? 'text-white drop-shadow-lg' : 'text-slate-900 group-hover:text-slate-950'}`}>
                    {category.name}
                  </h3>
                  
                  {/* Count Badge */}
                  <div className={`flex items-center gap-2 p-3 rounded-2xl shadow-lg transition-all group-hover:scale-105 backdrop-blur-sm ${
                    isActive 
                      ? 'bg-white/30 border border-white/50' 
                      : 'bg-gradient-to-r from-slate-100 to-slate-200 border hover:from-blue-100 hover:to-blue-200 border-slate-200'
                  }`}>
                    <div className="text-2xl font-black w-12 text-center">
                      {count}
                    </div>
                    <div className="h-2.5 bg-white/50 rounded-full flex-1 overflow-hidden shadow-inner mx-2">
                      <div 
                        className={`h-full rounded-full shadow-lg transition-all duration-1000 ${isActive ? 'bg-white' : `bg-gradient-to-r from-${color}-500 to-${color}-600`}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {percentage > 0 && (
                    <p className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-white/90 drop-shadow-md' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {percentage}% من الإجمالي
                    </p>
                  )}
                </div>
                
                {/* Shimmer Effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile Optimized List */}
      <div className="md:hidden space-y-4">
        {filteredCategories.map((category) => {
          const count = getNoteCount(category.id);
          return (
            <div key={category.id} className="group bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md flex-shrink-0 ${`bg-gradient-to-r from-${getCategoryColor(category.name)}-400 to-${getCategoryColor(category.name)}-500 text-white`}`}>
                  {category.name.slice(0,1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{count} نوت</p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold rounded-xl shadow-sm">
                      {count}
                    </span>
                    <button 
                      onClick={() => handleAddNote(category.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة نوت
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <div className="mt-12 px-4">
          <NoteForm 
            selectedCategory={categoryForForm!}
            onNoteAdded={() => {
              onNoteAdded();
              setShowAddForm(null);
            }}
            onClose={() => setShowAddForm(null)}
            inline={true}
          />
        </div>
      )}
    </div>
  );
}

