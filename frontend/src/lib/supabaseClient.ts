import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing!');
    console.error('VITE_SUPABASE_URL:', supabaseUrl);
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set (Hidden)' : 'Missing');
    // Basic fallback to prevent crash, but auth will fail
} else {
    console.log('Supabase Client Initializing:', {
        url: supabaseUrl,
        keyLength: supabaseAnonKey?.length,
        timestamp: new Date().toISOString()
    });
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
);
