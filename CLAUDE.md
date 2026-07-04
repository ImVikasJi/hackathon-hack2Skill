# Wanderland — GenAI Destination Discovery & Cultural Experiences

Hackathon build (hack2Skill PromptWars). Problem statement: help travelers discover
destinations and engage with local culture using GenAI — attractions, hidden gems,
immersive storytelling, heritage, local events, authentic cultural experiences.

## Stack
- Angular 22, standalone components only (NO NgModule)
- Tailwind CSS v4 for all styling (NO SCSS, NO component styles)
- Angular Signals for state (signal, computed, effect)
- Separate .ts / .html files per component (no inline templates)
- inject() for DI (NO constructor injection)
- Supabase for auth (email/password) + Postgres (discovery history)
- Gemini 2.5 Flash API (structured JSON output) for all generation

## Patterns
- OnPush change detection on all components
- toSignal() to convert Observables where needed
- Functional route guards (CanActivateFn)
- Environment values read from `src/environments/environment.ts` (gitignored,
  real secrets never committed — see `environment.example.ts`)
- Gemini calls always request `responseMimeType: application/json` with a
  `responseSchema` so output is parsed directly into typed models, never
  regex/string-scraped

## Folder structure
src/app/
  core/         ← supabase.service.ts, gemini.service.ts, auth.service.ts, guards/
  features/
    auth/       ← login, signup
    discover/   ← the core loop: destination form → AI results → save to history
    history/    ← past discoveries list/detail
  shared/       ← reusable UI (nav, spinner, card components)
  models/       ← discovery.model.ts, user.model.ts

## Naming
- Services: feature.service.ts
- Components: feature/feature.ts (class `Feature`), feature.html, no feature.css
- Guards: feature.guard.ts

## Do NOT
- Use NgModule
- Use constructor-based DI
- Hardcode API keys
- Use `any` type
- Write component-level CSS (Tailwind utility classes only)
