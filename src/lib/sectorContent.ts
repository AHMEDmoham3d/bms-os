import { supabase } from './supabase';
import { SectorContent } from './types';

const tableMap = {
  education: 'z_sector_a',
  healthcare: 'z_sector_b',
  fitness: 'z_sector_c',
};

export async function fetchSectorContent(sectorId: string): Promise<SectorContent[]> {
  const tableName = tableMap[sectorId as keyof typeof tableMap];
  if (!tableName) throw new Error('Invalid sector ID');

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    sector_id: sectorId,
    title: item.title,
    content: item.content,
    created_at: item.created_at,
  }));
}

export async function addSectorContent(sectorId: string, title: string, content: string): Promise<SectorContent> {
  const tableName = tableMap[sectorId as keyof typeof tableMap];
  if (!tableName) throw new Error('Invalid sector ID');

  const { data, error } = await supabase
    .from(tableName)
    .insert([{ title, content }])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    sector_id: sectorId,
    title: data.title,
    content: data.content,
    created_at: data.created_at,
  };
}

export async function updateSectorContent(id: string, sectorId: string, title: string, content: string): Promise<SectorContent> {
  const tableName = tableMap[sectorId as keyof typeof tableMap];
  if (!tableName) throw new Error('Invalid sector ID');

  const { data, error } = await supabase
    .from(tableName)
    .update({ title, content })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    sector_id: sectorId,
    title: data.title,
    content: data.content,
    created_at: data.created_at,
  };
}

export async function deleteSectorContent(id: string, sectorId: string): Promise<void> {
  const tableName = tableMap[sectorId as keyof typeof tableMap];
  if (!tableName) throw new Error('Invalid sector ID');

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
