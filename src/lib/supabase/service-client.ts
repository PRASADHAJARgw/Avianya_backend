import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const createServiceClient = () => {
  // If service role key is not configured, warn but don't crash
  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL - check your .env file');
  }
  
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.warn('⚠️ VITE_SUPABASE_SERVICE_ROLE_KEY not configured. Admin operations (user management) will not work.');
    console.warn('To fix: Get your service_role key from Supabase Dashboard → Settings → API');
    // Return a client with anon key as fallback (limited permissions)
    return createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY || '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
