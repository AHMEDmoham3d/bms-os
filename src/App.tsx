import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNotesData } from './lib/useNotesData';
import { useAuth } from './context/AuthContext';
import type { Note } from './lib/types';
import { companyInfo, sectors, products, teamMembers, financialProjections, productFeatures } from './data/company';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import NotesList from './components/NotesList';
import NoteModal from './components/NoteModal';
import GlobalSearch from './components/GlobalSearch';
import Overview from './components/Overview';
import SectorsComp from './components/Sectors';
import Products from './components/Products';
import Team from './components/Team';
import Projections from './components/Projections';
import LoginPage from './components/LoginPage';
import { FolderOpen, FileText } from 'lucide-react';

function Home() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-16 lg:px-12 relative z-0">
      <div className="text-center mb-20 px-4">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 to-gray-900 bg-clip-text text-transparent mb-6">
          BMC OS
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Build. Manage. Connect. Operating System
        </p>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Enterprise SaaS platform revolutionizing healthcare, education, and fitness industries.
        </p>
      </div>
      <Overview company={companyInfo} />
    </main>
  );
}

function NotesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const notesData = useNotesData();
  const { categories = [], notesByCategory, loading, error, refetch, deleteNote, updateNote } = notesData as { categories: Array<{ id: number; name: string }>; notesByCategory: Record<number, Note[]>; loading: boolean; error: string | null; refetch: () => void; deleteNote: (id: number) => void; updateNote: (id: number, updates: Partial<Note>) => Promise<void> };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'n') {
        e.preventDefault();
        // Trigger new note
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categoryNoteCounts = Object.fromEntries(
    Object.entries(notesByCategory).map(([k, v]) => [parseInt(k), (v as Note[]).length])
  ) as Record<number, number>;
  const totalNotes = Object.values(categoryNoteCounts).reduce((sum, count) => sum + count, 0);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const currentNotes = selectedCategoryId ? ((notesByCategory as Record<number, Note[]>)[selectedCategoryId] || []) : [];

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleNoteAdded = () => {
    refetch();
  };

  const handleDeleteNote = (noteId: number) => {
    deleteNote(noteId);
  };

  const handleUpdateNote = async (noteId: number, updates: Partial<Note>) => {
    await updateNote(noteId, updates);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-xl max-w-md shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-700 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-slate-900">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center p-8 max-w-md bg-white border border-slate-200 rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-6 border border-slate-300">
            <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77 .833 .192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => refetch()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold border border-slate-800 hover:bg-slate-800 transition-all shadow-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        onSelectNote={setSelectedNote}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 lg:p-16 shadow-2xl mb-8 sm:mb-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-16 px-2 sm:px-4 lg:px-0">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4">
                Notes Dashboard
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Professional note-taking with category organization and media support
              </p>
            </div>

            <section className="space-y-8">
              {/* Stats Bar */}
              <div className="bg-gradient-to-br from-slate-50/80 via-white to-slate-50/50 backdrop-blur-xl p-4 sm:p-6 lg:p-12 rounded-3xl border border-slate-200/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 items-center justify-center text-center lg:text-left max-w-4xl mx-auto px-2 sm:px-4 lg:px-0">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                      <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider group-hover:text-slate-800 transition-colors">Categories</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent drop-shadow-lg">{categories.length}</p>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-slate-300 hidden md:block" />
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-500/10 via-emerald-400/10 to-emerald-600/5 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                      <FileText className="w-7 h-7 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider group-hover:text-emerald-800 transition-colors">Total Notes</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">{totalNotes}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category Selector/Grid */}
            <div className="px-2 sm:px-4">
              <CategorySelector
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
                notesByCategory={categoryNoteCounts}
                onNoteAdded={handleNoteAdded}
              />
            </div>
            </section>

            {selectedCategory && (
              <section>
                <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
                  <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 rounded-xl border border-slate-200">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{selectedCategory.name}</h3>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 mt-2">
                      {currentNotes.length} notes
                    </p>
                  </div>
                </div>
                <NotesList 
                  notes={currentNotes} 
                  categories={categories} 
                  selectedCategory={selectedCategory} 
                  selectedNote={selectedNote}
                  onSelectNote={setSelectedNote}
                  onDeleteNote={handleDeleteNote} 
                  onNoteAdded={handleNoteAdded}
                  categoryStats={notesData.categoryStats}
                  recentNotes={notesData.recentNotes}
                />

              </section>
            )}

            {selectedNote && (
              <NoteModal 
                isOpen={true} 
                onClose={() => setSelectedNote(null)} 
                note={selectedNote}
                onUpdateNote={handleUpdateNote}
                categories={categories}
              />
            )}

            {categories.length === 0 && (
              <div className="text-center py-32 bg-slate-50 rounded-2xl p-12 border border-slate-200">
                <div className="w-28 h-28 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-300">
                  <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">No Categories</h3>
                <p className="text-lg sm:text-xl text-slate-600 mb-8">
                  Create categories in your Supabase dashboard first
                </p>
                <a href="https://kjrkqfwwixvapkhtssmh.supabase.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-lg border border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl">
                  Create Categories →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white border border-slate-200 rounded-3xl max-w-md shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 relative">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/sectors" element={<SectorsComp sectors={sectors} />} />
          <Route path="/products" element={<Products products={products} features={productFeatures} sectors={sectors} projections={financialProjections} />} />
          <Route path="/team" element={<Team teamMembers={teamMembers} sectors={sectors} />} />
          <Route path="/projections" element={<Projections projections={financialProjections} products={products} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

