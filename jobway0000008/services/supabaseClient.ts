
import { createClient } from '@supabase/supabase-js';

// Prefer using Vite env vars. Fallback to existing values if not provided.
const SUPABASE_URL = typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || (window as any)?.VITE_SUPABASE_URL)
  ? (process.env.VITE_SUPABASE_URL || (window as any).VITE_SUPABASE_URL)
  : 'https://xrqidloohnexqisxzoxa.supabase.co';

const SUPABASE_ANON_KEY = typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || (window as any)?.VITE_SUPABASE_ANON_KEY)
  ? (process.env.VITE_SUPABASE_ANON_KEY || (window as any).VITE_SUPABASE_ANON_KEY)
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycWlkbG9vaG5leHFpc3h6b3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODUxMTgsImV4cCI6MjA4MDI2MTExOH0.JcUYTSjZR_j4ZtuVtM5tEO0ccFX0xmb9m1Xwu3kvAAY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper para pegar o perfil do usuário logado (se houver sessão)
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Erro getCurrentUserProfile:', err);
    return null;
  }
};

// Create or update profile by email (useful without auth during MVP)
export const createProfile = async (profile: any) => {
  try {
    const payload = {
      id: profile.id, // optional
      name: profile.name || null,
      email: profile.email || null,
      phone: profile.phone || null,
      user_type: profile.user_type || 'CANDIDATE',
      address: profile.address || null,
      coordinates: profile.coordinates || null,
      created_at: new Date()
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert([payload], { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar/atualizar perfil:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error('Erro createProfile:', err);
    return { data: null, error: err };
  }
};

// Jobs CRUD
export const createJob = async (job: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select();
  return { data, error };
};

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const deleteJob = async (jobId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);
  return { data, error };
};

// Candidates CRUD (basic upsert)
export const upsertCandidate = async (candidate: any) => {
  const { data, error } = await supabase
    .from('candidates')
    .upsert([candidate])
    .select();
  return { data, error };
};
