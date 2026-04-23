import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { Category, Note } from './types';

interface NotesData {
  categories: Category[];
  notesByCategory: Record<number, Note[]>;
  allNotes: Note[];
  categoryStats: Record<number, { count: number; latest: string }>;
  totalNotes: number;
  recentNotes: Note[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}


export function useNotesData() {
  const [data, setData] = useState<NotesData>({
    categories: [],
    notesByCategory: {},
    allNotes: [],
    categoryStats: {},
    totalNotes: 0,
    recentNotes: [],
    loading: true,
    error: null,
    refetch: () => {},
  });


  const fetchAllData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      console.log('🔄 Fetching Supabase data...');

      // Fetch all categories
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (catError) {
        console.error('❌ Categories error:', catError);
        throw catError;
      }

      const categories: Category[] = categoriesData || [];

      // Fetch ALL notes - limit columns for safety
      const currentWsIdStr = localStorage.getItem('current_workspace_id');
      const currentWsId = currentWsIdStr ? parseInt(currentWsIdStr) : null;
      
      let query = supabase
        .from('notes')
        .select('id, title, content, category_id, workspace_id, image, video_url, created_at, priority, pinned, template')
        .order('created_at', { ascending: false });


      if (currentWsId) {
        query = query.eq('workspace_id', currentWsId);
      }

      const { data: allNotesData, error: notesError } = await query;

      if (notesError) {
        console.error('💥 NOTES FETCH ERROR:');
        console.error('- Status:', (notesError as any).status || 'N/A');
        console.error('- Code:', notesError.code);
        console.error('- Message:', notesError.message);
        console.error('- Details:', (notesError as any).details || 'N/A');
        console.error('Full:', notesError);
        throw notesError;
      }

      const allNotes: Note[] = (allNotesData || []).map((note: any) => ({
        ...note,
        tags: note.tags || [],
        priority: note.priority || 'medium' as const,
        pinned: Boolean(note.pinned),
      })) as Note[];

      console.log(`✅ Loaded ${categories.length} categories, ${allNotes.length} notes`);

      // Group notes by category_id
      const notesByCategory: Record<number, Note[]> = {};
      const categoryStats: Record<number, { count: number; latest: string }> = {};
      const recentNotes = allNotes.slice(0, 5);

      categories.forEach(cat => {
        const catNotes = allNotes.filter(note => note.category_id === cat.id);
        notesByCategory[cat.id] = catNotes;
        categoryStats[cat.id] = {
          count: catNotes.length,
          latest: catNotes.length > 0 ? new Date(catNotes[0].created_at).toLocaleDateString('en-US') : 'No notes'
        };
      });

      setData({
        categories,
        notesByCategory,
        allNotes,
        categoryStats,
        totalNotes: allNotes.length,
        recentNotes,
        loading: false,
        error: null,
        refetch,
      });

    } catch (err) {
      console.error('💥 Full Supabase fetch failed:', err as Error);
      
      // TEMP DISABLED MOCK - show real error
      setData({
        categories: [],
        notesByCategory: {},
        allNotes: [],
        categoryStats: {},
        totalNotes: 0,
        recentNotes: [],
        loading: false,
        error: 'Supabase connection failed. Check console for details.',
        refetch,
      });
      return;

    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Real-time subscriptions
  useEffect(() => {
    const notesChannel = supabase
      .channel('notes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    const categoriesChannel = supabase
      .channel('categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [fetchAllData]);

  const refetch = fetchAllData;

  const deleteNote = async (noteId: number) => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (!error) fetchAllData();
  };

  const updateNote = async (noteId: number, updates: Partial<Note>) => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();
    if (!error && data) fetchAllData();
    return data;
  };

  return { ...data, allNotes: data.notesByCategory ? Object.values(data.notesByCategory).flat() : [], refetch, deleteNote, updateNote };


}

