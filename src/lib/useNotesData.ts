import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { Category, Note } from './types';

export interface NotesData {
  categories: Category[];
  notesByCategory: Record<number, Note[]>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
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

      const allNotes: Note[] = (allNotesData || []).map(note => ({
        ...note,
        tags: (note as any).tags || [],
        priority: (note as any).priority || 'medium',
        pinned: (note as any).pinned || false,
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

  return { ...data, refetch, deleteNote, updateNote };

}

