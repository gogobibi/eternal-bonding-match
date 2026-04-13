# Task 3: Backend API Implementation

## Overview

Implements REST API routes for the eternal-bonding-match project using Hono + Cloudflare Workers + D1.

## File Structure

```
packages/worker/src/
├── index.ts              ← route registrations (updated)
├── types/
│   └── api.ts            ← domain types + Request/Response types
└── routes/
    ├── profiles.ts       ← POST /profiles
    ├── links.ts          ← POST /links, GET /links/:linkId
    └── match.ts          ← POST /match, GET /match/:matchId
```

## Endpoints

### POST /profiles
- Accepts survey data from frontend
- Generates `profile_id` via `crypto.randomUUID()`
- Stores JSON columns (arrays/objects) as stringified text in D1
- Returns `{ profile_id }`

### POST /links
- Accepts `{ profile_id }`
- Validates profile exists
- Generates `link_id` via `crypto.randomUUID()`
- Sets `expires_at` = now + 30 days
- Returns `{ link_id, expires_at }`

### GET /links/:linkId
- Fetches link by `link_id` where `expires_at > now()`
- Returns 404 if not found, 410 if expired
- Fetches associated profile, parses JSON columns
- Returns `{ link_id, profile_id, expires_at, profile }`

### POST /match
- Accepts `{ link_id_a, link_id_b }`
- Resolves both links to profile IDs (validates not expired)
- Ensures `profile_a_id < profile_b_id` (satisfies DB CHECK constraint)
- If match already exists for the pair, returns existing `match_id`
- Inserts match with stub values: `score=0`, `analysis='pending'`, `comment='pending'`
- Returns `{ match_id }`

### GET /match/:matchId
- Fetches match by `match_id`
- Returns 404 if not found
- Returns `{ match_id, score, analysis, comment, created_at }`

## D1 Binding

The D1 database binding name is `DB` (from `wrangler.toml`).

## JSON Columns

These profile columns store arrays/objects as JSON strings in D1:
- `me_age`, `me_weekday`, `me_weekend`
- `you_age`, `you_weekday`, `you_weekend`
- `coupling_priority`, `me_race`, `you_race`
- `my_jobs`, `my_selected`, `my_custom`
- `you_jobs`, `you_selected`, `you_custom`
- `play_styles`, `extra_items`

On write: `JSON.stringify()` before insert.
On read: `JSON.parse()` before returning.

## Error Handling

All routes use try/catch and return errors via `c.json({ error: message }, status)`.

## Notes

- AI integration (actual score calculation) is deferred to Task 4. POST /match uses stub values.
- `profile_a_id < profile_b_id` ordering is enforced in the application layer to satisfy the DB CHECK constraint and the UNIQUE index on `(profile_a_id, profile_b_id)`.
