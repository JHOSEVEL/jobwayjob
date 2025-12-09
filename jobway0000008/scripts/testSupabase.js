// script para testar conexão com Supabase localmente
// Usage:
// VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/testSupabase.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xrqidloohnexqisxzoxa.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycWlkbG9vaG5leHFpc3h6b3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODUxMTgsImV4cCI6MjA4MDI2MTExOH0.JcUYTSjZR_j4ZtuVtM5tEO0ccFX0xmb9m1Xwu3kvAAY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async () => {
  try {
    console.log('Testing Supabase connection...');
    const profile = {
      email: 'test_user@example.com',
      name: 'Test User',
      phone: '0000000000',
      user_type: 'CANDIDATE',
      address: { cep: '88010-500', city: 'Florianópolis', state: 'SC' },
      coordinates: { latitude: -27.5949, longitude: -48.5482 }
    };

    const { data, error } = await supabase.from('profiles').upsert([profile], { onConflict: 'email' }).select().single();
    if (error) {
      console.error('Erro ao upsert profile:', error);
    } else {
      console.log('Profile upserted:', data);
    }

    const jobs = await supabase.from('jobs').select('*').limit(3);
    console.log('Jobs sample:', jobs.error ? jobs.error : jobs.data);

  } catch (err) {
    console.error('Erro de script:', err);
  }
})();
