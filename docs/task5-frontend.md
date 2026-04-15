# Task 5: Frontend Implementation

## Overview

React + TypeScript + Vite + React Router v7 + Tailwind CSS frontend for the eternal-bonding-match service.
Deployed to Cloudflare Pages, connects to backend via `/api/*` proxy.

## Stack

- React 19 + TypeScript
- Vite 6 (with `@tailwindcss/vite` plugin)
- React Router DOM v7
- Tailwind CSS v4

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Start screen with 2 CTAs |
| `/form` | `FormPage` | 6-section step form |
| `/share/:linkId` | `SharePage` | Link copy UI |
| `/match` | `MatchInputPage` | Enter A link + B link |
| `/result/:matchId` | `ResultPage` | Match result display |

## File Structure

```
packages/frontend/src/
├── App.tsx                   ← router setup
├── types/
│   └── api.ts                ← shared API contract types
├── api/
│   └── client.ts             ← fetch wrapper functions
└── pages/
    ├── HomePage.tsx
    ├── FormPage/
    │   ├── index.tsx          ← orchestrates 6 sections
    │   ├── Section1Basic.tsx
    │   ├── Section2Character.tsx
    │   ├── Section3Content.tsx
    │   ├── Section4PlayStyle.tsx
    │   ├── Section5ServerPlan.tsx
    │   └── Section6Extra.tsx
    ├── SharePage.tsx
    ├── MatchInputPage.tsx
    └── ResultPage.tsx
```

## API Functions (src/api/client.ts)

- `postProfile(data: ProfileInput): Promise<{ profile_id: string }>`
- `postLink(profileId: string): Promise<{ link_id: string }>`
- `getLink(linkId: string): Promise<{ profile_id: string }>`
- `postMatch(linkIdA: string, linkIdB: string): Promise<{ match_id: string }>`
- `getMatch(matchId: string): Promise<MatchResult>`

## Domain Types (src/types/api.ts)

Derived from DB schema (migrations/0001_init.sql):

- `ServerType`: 5 FFXIV Korean servers
- `CouplingType`: BL | GL | HL
- `RaceType`: 10 FFXIV races
- `CustomKeywordItem`: `{ id, text, emphasized }`
- `PlayStyleItem`: `{ id, text, emphasized }`
- `ProfileInput`: all DB columns mapped to TypeScript

## Form Sections

1. **기본 정보** – nickname, server, me/you gender, me/you age, me/you activity time
2. **캐릭터** – coupling priority, me race, you race
3. **컨텐츠 성향** – my jobs, selected content, custom keywords; you contents toggle
4. **플레이 스타일** – dynamic list with text + emphasize toggle
5. **서버 플랜** – server move, cross server, covenant plan
6. **기타** – dynamic list with text + emphasize toggle

## Design Direction

- Tailwind CSS, mobile-first, responsive
- FFXIV fantasy theme: dark navy + gold accent palette
- Korean UI text throughout
- Step indicator for multi-section form

## Tailwind Setup

1. `npm install -D tailwindcss @tailwindcss/vite`
2. `vite.config.ts`: add `import tailwindcss from '@tailwindcss/vite'` and register in `plugins`
3. `src/index.css`: `@import "tailwindcss"` at top
