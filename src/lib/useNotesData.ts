import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { Category, Note } from './types';


  notesByCategory: Record<number, Note[]>;
  allNotes: Note[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPrevNextNote: (categoryId: number, currentId: number) => { prev?: Note, next?: Note };
}

export function useNotesData() {
  const [data, setData] = useState({
    categories: [] as Category[],
    notesByCategory: {} as Record<number, Note[]>,
    loading: true,
    error: null as string | null,
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
      const { data: allNotesData, error: notesError } = await supabase
        .from('notes')
        .select('id, title, content, category_id, image, video_url, created_at')
        .order('created_at', { ascending: false });

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
      categories.forEach(cat => {
        notesByCategory[cat.id] = allNotes.filter(note => note.category_id === cat.id);
      });

      setData({
        categories,
        notesByCategory,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('💥 Full Supabase fetch failed:', err as Error);
      
      // TEMP DISABLED MOCK - show real error
      setData({
        categories: [],
        notesByCategory: {},
        loading: false,
        error: 'Supabase connection failed. Check console for details.',
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

  const getPrevNextNote = (categoryId: number, currentId: number) => {
    const categoryNotes = data.allNotes.filter(n => n.category_id === categoryId);
    const currentIndex = categoryNotes.findIndex(n => n.id === currentId);
    return {
      prev: currentIndex > 0 ? categoryNotes[currentIndex - 1] : undefined,
      next: currentIndex < categoryNotes.length - 1 ? categoryNotes[currentIndex + 1] : undefined,
    };
  };

  return { ...data, allNotes: data.notesByCategory ? Object.values(data.notesByCategory).flat() : [], refetch, deleteNote, updateNote, getPrevNextNote };

}

