// Neutral backend stub (replaces previous Supabase-specific client)
// Provides minimal functions used across the app so the project runs
// without any Supabase dependency.

export const auth = {
  signInWithPassword: async ({ email, password }: any) => {
    // fake auth success for development/demo
    return { data: { user: { email } }, error: null };
  },
  signUp: async (opts: any) => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
};

export async function getCurrentUserProfile() {
  // return null so app uses fallback flows
  return null;
}

export async function getJobs() {
  // empty dataset; UI has mock data fallback
  return { data: [], error: null };
}

export async function createProfile(profile: any) {
  // pretend saved
  return { data: profile, error: null };
}

export default {
  auth,
  getCurrentUserProfile,
  getJobs,
  createProfile
};
