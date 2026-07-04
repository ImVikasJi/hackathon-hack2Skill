// Copy this file to `environment.ts` (and `environment.prod.ts` for production)
// and fill in real values. Both filenames are gitignored so secrets never
// get committed.
//
// Note: there is no Gemini key here — it lives only as a Supabase Edge
// Function secret (`supabase secrets set GEMINI_API_KEY=...`) and never
// reaches the browser. See supabase/functions/discover.
export const environment = {
  production: false,
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
};
