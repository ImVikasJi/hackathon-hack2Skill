// Supabase Edge Function: proxies Gemini so the API key never reaches the browser.
// Deploy with: supabase functions deploy discover
// Secret set with: supabase secrets set GEMINI_API_KEY=your-key
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const listItemSchema = (properties: Record<string, { type: string }>) => ({
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties,
    required: Object.keys(properties),
  },
});

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    heritageSummary: { type: 'STRING' },
    story: { type: 'STRING' },
    attractions: listItemSchema({
      name: { type: 'STRING' },
      description: { type: 'STRING' },
      category: { type: 'STRING' },
    }),
    hiddenGems: listItemSchema({
      name: { type: 'STRING' },
      description: { type: 'STRING' },
      whyItsSpecial: { type: 'STRING' },
    }),
    localEvents: listItemSchema({
      name: { type: 'STRING' },
      description: { type: 'STRING' },
      bestTimeToVisit: { type: 'STRING' },
    }),
    culturalExperiences: listItemSchema({
      name: { type: 'STRING' },
      description: { type: 'STRING' },
      etiquetteTip: { type: 'STRING' },
    }),
  },
  required: [
    'heritageSummary',
    'story',
    'attractions',
    'hiddenGems',
    'localEvents',
    'culturalExperiences',
  ],
};

function buildPrompt(destination: string, interests: string): string {
  return `You are a knowledgeable local cultural guide and travel storyteller.
Destination: ${destination}
Traveler interests: ${interests || 'general sightseeing and culture'}

Generate, in valid JSON matching the response schema:
- heritageSummary: 2-3 sentences on the destination's cultural/historical heritage.
- story: an immersive, vivid 4-6 sentence narrative that transports the reader into the destination's atmosphere, tailored to the traveler's interests.
- attractions: 4 well-known must-see attractions.
- hiddenGems: 3 lesser-known, authentic local spots most tourists miss.
- localEvents: 3 real or typical seasonal local festivals/events with the best time to visit.
- culturalExperiences: 3 authentic cultural experiences (food, craft, ritual, etc.) with a short etiquette tip for respectful participation.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return jsonResponse({ error: 'Server misconfigured: missing Gemini key' }, 500);
  }

  let destination: string;
  let interests: string;

  try {
    const body = await req.json();
    destination = typeof body.destination === 'string' ? body.destination.trim() : '';
    interests = typeof body.interests === 'string' ? body.interests.trim() : '';
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!destination) {
    return jsonResponse({ error: 'destination is required' }, 400);
  }

  const geminiRequest = {
    contents: [{ parts: [{ text: buildPrompt(destination, interests) }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.9,
    },
  };

  const geminiRes = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiRequest),
  });

  if (!geminiRes.ok) {
    return jsonResponse({ error: 'Gemini request failed' }, 502);
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return jsonResponse({ error: 'Gemini returned no content' }, 502);
  }

  try {
    const parsed = JSON.parse(text);
    return jsonResponse({ destination, ...parsed });
  } catch {
    return jsonResponse({ error: 'Gemini returned malformed JSON' }, 502);
  }
});
