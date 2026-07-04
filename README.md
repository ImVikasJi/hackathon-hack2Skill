# Wanderland — GenAI Destination Discovery & Cultural Experiences

Built for the hack2Skill PromptWars challenge: *Destination Discovery & Cultural Experiences*.
Enter a destination and your interests; Gemini generates must-see attractions, hidden gems,
an immersive story, local events, and authentic cultural experiences with etiquette tips.
Discoveries are saved to your account (Supabase) so you can revisit them later.

**Stack:** Angular 22 (standalone, signals) · Tailwind CSS v4 · Supabase (auth + Postgres) ·
Gemini 2.5 Flash (structured JSON output) · deployed on Vercel.

The Gemini API key is never sent to the browser. The Angular app calls a
Supabase Edge Function (`supabase/functions/discover`), which holds the key
as a server-side secret and proxies the Gemini request.

## Setup

1. `npm install`
2. Create a Supabase project, then run `supabase/schema.sql` in its SQL editor
   (creates the `discoveries` table with row-level security).
3. Deploy the edge function and set its secret (requires the
   [Supabase CLI](https://supabase.com/docs/guides/cli)):
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   supabase functions deploy discover
   ```
4. Copy `src/environments/environment.example.ts` to
   `src/environments/environment.ts` and fill in `supabaseUrl` /
   `supabaseAnonKey` from Supabase project settings → API. (No Gemini key
   goes here — see above.)
5. `npm start` → http://localhost:4200

## Deploying to Vercel

Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables in the
Vercel project settings. The `prebuild` script (`scripts/set-env.js`)
generates `environment.ts`/`environment.prod.ts` from those vars at build
time, so no secrets need to be committed to git. `GEMINI_API_KEY` is set once
on Supabase (step 3 above), not on Vercel — it's never part of the frontend
build.

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
