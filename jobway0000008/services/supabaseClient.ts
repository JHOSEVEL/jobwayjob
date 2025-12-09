// Lightweight stub of Supabase client functions so the app can build
// These return harmless mock responses. Replace with real Supabase
// implementation when re-enabling backend integration.

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      // Fake success for local demo — do NOT use in production
      return { data: { user: { email } }, error: null };
    },
    signUp: async (opts: any) => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  }
};

export async function getCurrentUserProfile() {
  // Return null so app falls back to demo flows.
  return null;
}

export async function getJobs() {
  // Return empty result set; UI has mock jobs as fallback
  return { data: [], error: null };
}

export async function createProfile(profile: any) {
  // No-op stub: pretend profile saved successfully
  return { data: profile, error: null };
}

export default supabase;
