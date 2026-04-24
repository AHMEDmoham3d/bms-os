import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Calendar, BarChart3 } from 'lucide-react';
import type { Note, Category } from '../lib/types';

interface PieChartProps {
  notes: Note[];
  categories: Category[];
  onCategorySelect?: (categoryId: number | null) => void;
}

const PALETTE = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-pink-500',
];

export default function PieChart({ notes, categories, onCategorySelect }: PieChartProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const data = categories
    .map((cat, i) => ({
      ...cat,
      count: notes.filter((n) => n.category_id === cat.id).length,
      color: PALETTE[i % PALETTE.length],
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = data.length > 0 ? Math.max(...data.map((d) => d.count)) : 0;

  const latestNote = notes.length > 0
    ? notes.reduce((latest, note) =>
        new Date(note.created_at) > new Date(latest.created_at) ? note : latest
      )
    : null;

  const handleCategoryClick = (id: number) => {
    const next = activeCategory === id ? null : id;
    setActiveCategory(next);
    onCategorySelect?.(next);
  };

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl"
      >
        <div className="relative w-28 h-28 mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
            <circle cx="60" cy="60" r="44" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <motion.circle
              cx="60" cy="60" r="44" fill="none" stroke="#cbd5e1" strokeWidth="12"
              strokeLinecap="round" strokeDasharray="276" strokeDashoffset="276"
              initial={{ strokeDashoffset: 276 }}
              animate={{ strokeDashoffset: 180 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              transform="rotate(-90 60 60)"
            />
            <circle cx="60" cy="60" r="28" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-slate-300">0</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700 text-center px-4">
          Start adding notes to see your category distribution
        </p>
        <p className="text-xs text-slate-400 mt-1 text-center px-4">
          Your notes will be grouped by category here
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase">Notes</span>
          </div>
          <p className="text-2xl font-black text-blue-900">{total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase">Categories</span>
          </div>
          <p className="text-2xl font-black text-emerald-900">{categories.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase">Latest</span>
          </div>
          <p className="text-lg font-black text-amber-900 leading-tight">
            {latestNote
              ? new Date(latestNote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'}
          </p>
        </motion.div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Category Breakdown</h4>
        </div>

        {data.map((item, index) => {
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
          const width = maxCount === 0 ? 0 : (item.count / maxCount) * 100;
          const isActive = activeCategory === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`cursor-pointer rounded-xl p-3 transition-all ${
                isActive
                  ? 'bg-slate-100 ring-2 ring-slate-300'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => handleCategoryClick(item.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-bold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-600">{item.count}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeCategory !== null && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handleCategoryClick(activeCategory)}
          className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
        >
          Clear Filter
        </motion.button>
      )}
    </div>
  );
}

