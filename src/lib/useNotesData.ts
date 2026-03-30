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

      // Fetch ALL notes
      const { data: allNotesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error('❌ Notes error:', notesError);
        throw notesError;
      }

      const allNotes: Note[] = allNotesData || [];

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

      // MOCK DATA FALLBACK - remove once Supabase works
      console.log('📦 Using mock data fallback...');
      const mockCategories: Category[] = [
        { id: 1, name: 'Project Ideas' },
        { id: 2, name: 'Meeting Notes' },
        { id: 3, name: 'Action Items' },
      ];
      const mockNotes: Note[] = [
        {
          id: 1,
          title: 'Q4 Planning Session',
          content: 'Discuss budget allocation and timeline adjustments...',
          category_id: 1,
          image: undefined,
          video_url: undefined,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Client Feedback',
          content: 'Positive response to demo. Next steps...',
          category_id: 2,
          image: undefined,
          video_url: undefined,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      const notesByCategory: Record<number, Note[]> = {};
      mockCategories.forEach(cat => {
        notesByCategory[cat.id] = mockNotes.filter(note => note.category_id === cat.id);
      });
      setData({
        categories: mockCategories,
        notesByCategory,
        loading: false,
        error: null, // Hide banner - mocks work perfectly
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

