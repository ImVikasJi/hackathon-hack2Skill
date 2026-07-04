// Generates src/environments/environment*.ts from process.env at build time.
// Lets Vercel (or any CI) inject secrets via dashboard env vars instead of
// committing them to git. Local dev can skip this and edit environment.ts
// directly (copy environment.example.ts).
//
// Note: GEMINI_API_KEY is NOT read here — it must never reach the client
// bundle. It's set as a Supabase Edge Function secret instead:
//   supabase secrets set GEMINI_API_KEY=your-key
const fs = require('fs');
const path = require('path');

const { SUPABASE_URL = '', SUPABASE_ANON_KEY = '' } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('[set-env] SUPABASE_URL/SUPABASE_ANON_KEY missing, skipping generation (using existing environment.ts)');
  process.exit(0);
}

const template = (production) => `export const environment = {
  production: ${production},
  supabaseUrl: '${SUPABASE_URL}',
  supabaseAnonKey: '${SUPABASE_ANON_KEY}',
};
`;

const dir = path.join(__dirname, '..', 'src', 'environments');
fs.writeFileSync(path.join(dir, 'environment.ts'), template(false));
fs.writeFileSync(path.join(dir, 'environment.prod.ts'), template(true));
console.log('[set-env] wrote environment.ts / environment.prod.ts from process.env');
