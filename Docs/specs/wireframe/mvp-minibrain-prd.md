Generate AI Feature Prompt
You are a TypeScript developer. I need you to add a feature casually known to me as a "mini brain".

What it does. 
The mini brain is a small, focused service in Compass that reads a user’s paragraph or draft, looks up the most relevant camps and authors in the canon, and returns a short summary plus “present vs missing” perspectives as editorial guidance. It takes the product beyond being just a research/search tool into a practical content partner for PMMs, helping them shape sharper POVs and spot narrative gaps at the moment of writing.

# Goal

Implement a minimal “Mini Brain” that can read a paragraph-to-page of text, look up relevant camps/authors from the existing canon database (Supabase), and return editorial suggestions grounded in that canon.

It must be simple enough to ship now, and structured enough to extend later (memory, web search, multi-leader POV).

## In scope for V1
1.1 In-scope for v0

One API endpoint (or workflow) that:

Accepts paragraph-long or short-essay text (roughly 1–3 paragraphs; up to ~1,500–2,000 words is fine).

Queries the existing canon (whatever schema you have for authors/camps/domains/sources).

Returns:

Relevant camps and authors, with simple relevance scores.

A small set of editorial suggestions:

Which perspectives you’re leaning on.

Which canon perspectives might be missing.

A couple of “consider adding…” style suggestions.

No schema changes required.

No web search, no embeddings required (can be added later).

No persistent narrative memory yet (v0 is stateless).

1.2 Out-of-scope for v0 (explicit)

To avoid over-building:

❌ No storing of content pieces, coverage history, or dashboards.

❌ No external web / Flowwise / tavily integration.

❌ No multi-leader POV modeling.

❌ No strict SQL contracts or migrations.

2. Assumptions (Technical + Data)

These are assumptions for the implementation. They should be treated as things for the dev to adapt to the codebase, not fixed truths.

2.1. Runtime / stack

Backend is accessible via:

either a Next.js API route (/api/brain/analyze or similar),

or an n8n workflow triggered via webhook.

There is already a way to query the canon database (Supabase or equivalent) from backend code.

2.2. Canon data

There exist one or more tables or views representing:

Camps / categories of thought (e.g. “Scaling Maximalists”).

Authors / thought leaders.

Optionally sources (articles, posts, etc.).

At minimum we can:

get a list of all camps,

get a list of authors with their linked camps,

search across one or more text fields per camp/author (e.g. description, notes, position summaries, source titles).

3. LLM availability

We can call at least one LLM (Gemini,etc.) from backend code to:

extract keywords/phrases from the input text,

generate editorial suggestions in natural language.

3. External Feature Contract
3.1 Endpoint

Suggested route: POST /api/brain/analyze

Auth: Same as other internal Compass APIs (use existing pattern; can be public dev-only at first).
Designed to handle ~1–3 paragraphs, but shouldn’t break for longer pieces.

Hard limit can be set (e.g. truncate beyond 4,000 characters for v0).

3.3 Response body
This is the stable contract; internal implementation can evolve. Key idea: Even in v0, the API returns editorial suggestions, not just raw matches. That’s where it becomes a content helper, not just a search wrapper.
{
  "summary": "2–3 sentence summary of the text.",
  "matchedCamps": [
    {
      "campLabel": "Scaling Maximalists",
      "topAuthors": [
        { "name": "Author Name" }
      ]
    }
  ],
  "editorialSuggestions": {
    "presentPerspectives": [
      "You emphasize scaling and technical progress."
    ],
    "missingPerspectives": [
      "You barely mention worker impact or governance."
    ]
  }
}


# General instructions:
Use the Gemini API with the following requirements:
- ALWAYS use the gemini-2.0-flash model (never change this)
- Use TypeScript with proper typing
- Use fetch() for HTTP requests
- Use GEMINI_API_KEY environment variable (server-side)
- Handle errors appropriately
- Return the response in a usable format
- This will run as a NextJS server action
Convert this curl example to TypeScript:
curl “https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent” \
 -H ‘Content-Type: application/json’ \
 -H ‘X-goog-api-key: GEMINI_API_KEY’ \
 -X POST \
 -d ‘{
  “contents”: [
   {
    “parts”: [
     {
      “text”: “Explain how AI works in a few words” #note this is just the example prompt.
     }
    ]
   }
  ]
 }’
Requirements:
- Create a server action function that takes user input and returns Gemini’s response
- Use process.env.GEMINI_API_KEY for the API key
- Add proper TypeScript interfaces for the request/response
- Include error handling for network issues and API errors
- Use “use server” directive
- Show how to call this server action from a client component
Show me the complete TypeScript code for both the server action and example client usage.