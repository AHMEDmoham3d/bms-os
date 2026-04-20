import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Workspace } from './types';
import { useAuth } from '../context/AuthContext';

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch workspaces
  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });


      if (error) {
        setError(error.message);
        console.error('Workspaces fetch error:', error);
      } else {
        setWorkspaces(data || []);
        // Set current from localStorage or first/default
        const savedId = localStorage.getItem('current_workspace_id');
        const wsId = savedId ? parseInt(savedId) : (data?.[0]?.id || null);
        if (wsId) {
          setCurrentWorkspaceId(wsId);
          localStorage.setItem('current_workspace_id', wsId.toString());
        }
      }
      setLoading(false);
    };

    fetchWorkspaces();

    // Real-time
    const subscription = supabase
      .channel('workspaces')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'workspaces' },
        () => fetchWorkspaces()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const createWorkspace = async (name: string): Promise<Workspace | null> => {
    if (!user?.id || !name.trim()) return null;

    const { data, error } = await supabase
      .from('workspaces')
      .insert({ 
        name: name.trim(), 
        user_id: user!.id, 
        is_default: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Create workspace error:', error);
      return null;
    }
    return data;
  };

  const switchWorkspace = (id: number) => {
    setCurrentWorkspaceId(id);
    localStorage.setItem('current_workspace_id', id.toString());
  };

  const deleteWorkspace = async (id: number) => {
    const ws = workspaces.find(w => w.id === id);
    if (ws?.is_default || !user) return false;

    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)
      .eq('user_id', user!.id);

    if (error) {

      console.error('Delete error:', error);
      return false;
    }
    // Switch to another if current deleted
    if (currentWorkspaceId === id) {
      const nextWs = workspaces.find(w => w.id !== id);
      if (nextWs) switchWorkspace(nextWs.id);
    }
    return true;
  };

  const updateWorkspace = async (id: number, name: string) => {
    const { error } = await supabase
      .from('workspaces')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user!.id);

    if (error) console.error('Update error:', error);
  };


  // Create default if none exist
  useEffect(() => {
    if (workspaces.length === 0 && user?.id) {
      createWorkspace('Personal');
    }
  }, [workspaces.length, user]);

  return {
    workspaces,
    currentWorkspaceId,
    loading,
    error,
    createWorkspace,
    switchWorkspace,
    deleteWorkspace,
    updateWorkspace
  };
}
