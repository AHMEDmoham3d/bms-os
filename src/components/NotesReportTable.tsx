import type { Note, Category } from '../lib/types';
import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Plus, Download, Eye, FileText } from 'lucide-react';
import NoteActions from './NoteActions';
import NoteForm from './NoteForm';
import { motion, AnimatePresence } from 'framer-motion';

interface NotesReportTableProps {
  notes: Note[];
  categories: Category[];
  selectedCategory: Category;
  selectedNote: Note | null;
  categoryStats?: Record<number, { count: number; latest: string }>;
  recentNotes: Note[];
  onSelectNote: (note: Note | null) => void;
  onDeleteNote: (id: number) => void;
  onNoteAdded: () => void;
}

export default function NotesReportTable({
  notes,
  categories,
  selectedCategory,
  selectedNote,
  categoryStats,
  recentNotes,
  onSelectNote,
  onDeleteNote,
  onNoteAdded
}: NotesReportTableProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'priority'>('date');
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityOrder = { low: 0, medium: 1, high: 2 };
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDesc 
        ? b.title.localeCompare(a.title) 
        : a.title.localeCompare(b.title);
    }
    if (sortBy === 'date') {
      return sortDesc 
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'priority') {
      return sortDesc 
        ? priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
        : priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  const paginatedNotes = sortedNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const category = categories.find(c => c.id === selectedCategory.id);
  const catStats = categoryStats?.[selectedCategory.id];

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return `px-3 py-1 rounded-full text-xs font-bold border inline-block ${colors[priority as keyof typeof colors] || ''}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportCSV = () => {
    const csv = [
      ['Title', 'Category', 'Date', 'Priority', 'Tags'],
      ...notes.map(note => [
        `"${note.title}"`,
        category?.name || 'General',
        formatDate(note.created_at),
        note.priority,
        note.tags.join(', ')
      ])
    ].map(row => row.join(',')).join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${selectedCategory.name}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 lg:p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black mb-2">{selectedCategory.name} Report</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                <FileText className="w-4 h-4" />
                {notes.length} total notes
              </span>
              {catStats && (
                <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                  Latest: {catStats.latest}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl font-bold backdrop-blur-sm border border-white/30 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl font-bold backdrop-blur-sm border border-white/30 transition-all hover:scale-105"
              title="Export CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 ring-slate-200/50 focus:border-slate-400 bg-slate-50/50 text-lg placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl border transition-all">
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button 
              onClick={() => {
                setSortBy(sortBy === 'date' ? 'priority' : sortBy === 'priority' ? 'title' : 'date');
                setSortDesc(!sortDesc);
              }}
              className="flex items-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              {sortDesc ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section - Simple SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            Category Distribution
          </h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
            <span className="text-6xl font-black text-slate-300">📊</span>
            <p className="text-sm text-slate-500 mt-4 text-center">Pie chart coming soon</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentNotes.slice(0, 5).map((note, idx) => (
              <motion.div 
                key={note.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group"
                onClick={() => onSelectNote(note)}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate group-hover:underline">{note.title}</p>
                  <p className="text-sm text-slate-500 truncate">{formatDate(note.created_at)}</p>
                </div>
                <Eye className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 className="text-2xl font-black text-slate-900">Notes Table ({filteredNotes.length} of {notes.length})</h3>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="w-full min-w-[600px] md:min-w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-900 text-white">
                <th className="px-4 py-4 text-left font-bold text-sm md:px-6">Title</th>
                <th className="px-4 py-4 text-left font-bold text-sm hidden md:table-cell md:px-6">Category</th>
                <th className="px-4 py-4 text-left font-bold text-sm md:px-6">Date</th>
                <th className="px-4 py-4 text-left font-bold text-sm md:px-6 hidden lg:table-cell">Priority</th>
                <th className="px-4 py-4 text-left font-bold text-sm md:px-6 hidden xl:table-cell">Tags</th>
                <th className="px-4 py-4 text-left font-bold text-sm md:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotes.map((note, index) => (
                <motion.tr 
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer even:bg-slate-50/50 group"
                  onClick={() => onSelectNote(selectedNote?.id === note.id ? null : note)}
                >
<td className="px-4 py-4 font-semibold text-slate-900 group-hover:text-slate-700 max-w-[200px] md:max-w-xs truncate md:px-6">
                    {note.title}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-sm text-slate-600 md:px-6">
                    {categories.find(c => c.id === note.category_id)?.name || 'General'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(note.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={getPriorityBadge(note.priority)}>{note.priority.toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && <span className="text-xs text-slate-500">+{note.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <NoteActions note={note} onDeleteNote={onDeleteNote} />
                  </td>
                </motion.tr>
              ))}
              {paginatedNotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center text-slate-500">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl font-semibold mb-2">No notes match your search</p>
                    <p className="text-lg">Try adjusting filters or create a new note</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredNotes.length)} of {filteredNotes.length} notes
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 font-semibold transition-all"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-slate-600 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 font-semibold transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl"
          >
            <NoteForm 
              selectedCategory={selectedCategory}
              onNoteAdded={onNoteAdded}
              editingNote={undefined}
              onClose={() => setShowAddForm(false)}
              inline={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

