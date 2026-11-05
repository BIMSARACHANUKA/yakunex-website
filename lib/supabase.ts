import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const isValidConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    /^https?:\/\//i.test(supabaseUrl) &&
    !supabaseUrl.includes('your-project-id.supabase.co') &&
    supabaseAnonKey !== 'your-anon-key-here'
);

/**
 * Supabase client instance.
 * Returns null if environment variables are not yet configured,
 * ensuring the application builds and runs safely in any environment.
 */
export const supabase =
  isValidConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;


