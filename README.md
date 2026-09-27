# Personal AI Communication Agent

A long-term **spoken-communication coach** for a single user. Speak into your microphone, get scored
by Gemini, and watch your communication improve over weeks and months through a practice heatmap,
monthly score trajectories, and a personal story bank.

The app is branded **ANTIGRAVITY** in the UI.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Architecture](#architecture)
  - [Project Layout](#project-layout)
  - [Backend API](#backend-api)
  - [Database Schema](#database-schema)
  - [Training Modes](#training-modes)
  - [AI Evaluation Pipeline](#ai-evaluation-pipeline)
  - [Speech Tracking](#speech-tracking)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

---

## What It Does

1. **Practice** — You speak into the mic (Web Speech API) and optionally on camera across **8 training
   modes** covering live coaching, storytelling, public speaking, interviews, spontaneity, and
   plain-language explanation.
2. **Get evaluated** — The transcript is scored out of **10.0** across **14 communication metrics**,
   plus timeline *replay markers* and *Why-Based Coaching* principle cards.
3. **Track long-term progress** — Every session is persisted to SQLite and rolled up into a profile
   score, a 90-day practice heatmap, monthly reports, and a daily-workout streak.
4. **Build a Story Bank** — Store raw vs. polished versions of your life stories, each mapped to the
   behavioral-interview questions it can answer.

> *"Your long-term storytelling & public speaking mentor. Consistently observing, coaching, measuring,
> and demonstrating your communication transformation over time."*

---

## Tech Stack

**Frontend**

| Package | Version | Purpose |
| --- | --- | --- |
| `react` / `react-dom` | ^19.2.8 | UI (SPA, no router) |
| `vite` | ^8.3.0 | Dev server + bundler |
| `@vitejs/plugin-react` | ^6.1.1 | React transform (Oxc-based, no SWC) |
| `tailwindcss` | ^4.3.3 | Styling (v4 CSS-first `@theme` config) |
| `recharts` | ^3.10.1 | Score-trajectory area chart |
| `lucide-react` | ^1.48.0 | Icon set |
| `typescript` | ~6.0.2 | Type checking |

**Backend**

| Package | Version | Purpose |
| --- | --- | --- |
| `express` | ^5.2.1 | HTTP API |
| `better-sqlite3` | ^13.0.3 | Local persistence |
| `cors` | ^2.8.6 | Cross-origin access for the Vite dev server |
| `tsx` | ^4.23.15 | Runs the TypeScript server without a build step |
| `@google/genai` | ^2.24.0 | Gemini client |

**Tooling:** `oxlint` (not ESLint), `postcss` + `autoprefixer`.

---

## Quick Start

**Requirements:** Node.js 20+, and a Chromium-based browser (Chrome/Edge) for the Web Speech API.

```bash
npm install
cp .env.example .env    # optional — the app runs fine without a key
```

The app is a **frontend + backend pair that run as two separate processes**. There is no
`concurrently` dependency, so open two terminals:

**Terminal 1 — API server (port 3001)**

```bash
npm run server
```

**Terminal 2 — Vite dev server (port 5173)**

```bash
npm run dev
```

Open **http://localhost:5173**.

### It runs without any API key

`evaluateSession()` only calls Gemini when `VITE_GEMINI_API_KEY` is set. If it is missing — or the
call fails for any reason — the app falls back to `generateIntelligentMockEvaluation()`, a local
heuristic engine that counts filler words via regex, computes words-per-minute, and applies
mode-specific score nudges (`src/services/aiCoachService.ts:34`).

The backend is also optional. `src/services/api.ts` ships a complete local fallback dataset for every
endpoint, so the UI is fully browsable with `npm run server` stopped. In that state nothing is
persisted, and `getSessions()` returns `[]`.

---

## Environment Variables

Copy the example file and fill in your key:

```bash
cp .env.example .env    # Windows PowerShell: Copy-Item .env.example .env
```

Then edit `.env`:

```bash
# Get a key at https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_key_here

# Optional — backend port. Defaults to 3001.
PORT=3001
```

| Variable | Required | Read by | Notes |
| --- | --- | --- | --- |
| `VITE_GEMINI_API_KEY` | No | `src/services/aiCoachService.ts:12` | The only variable that actually works. Vite inlines `VITE_*` vars into the browser bundle. |
| `PORT` | No | `server/index.ts:9` | Backend port. Defaults to `3001`. |
| `GEMINI_API_KEY` | No | — | **Unused.** The `process.env` fallback in `aiCoachService.ts:12` is guarded by `typeof process !== 'undefined'`, which is always false in a browser bundle, so it resolves to `''`. The Express server never reads it. |

> ⚠️ **Security note:** because Gemini is called from the browser, `VITE_GEMINI_API_KEY` is shipped
> in cleartext in the client bundle. That is acceptable only for a local, single-user tool. For a
> deployed app, move the `@google/genai` call into `server/` and proxy it through an API route.

### Secret handling

`.gitignore` excludes `.env`, every other `.env.*` variant, and the SQLite database files. Only
`.env.example` — which contains placeholders, never real values — is tracked:

```
.env                     ignored
.env.local               ignored
.env.example             tracked  (placeholders only)
communication_agent.db*  ignored
```

Because `*.local` is also ignored, Vite's own `.env.local` convention is covered by the same rule.
If a `.env` file was ever committed before this rule existed, git will still track it — remove it from
the index with `git rm --cached .env` and rotate the exposed key.


---

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `vite` | Frontend only, on http://localhost:5173. Does **not** start the API. |
| `npm run server` | `tsx server/index.ts` | Backend only, on port 3001 (or `$PORT`). |
| `npm run build` | `tsc -b && vite build` | Type-checks and bundles the frontend to `dist/`. Does **not** compile the server. |
| `npm run preview` | `vite preview` | Serves the built `dist/` output. |
| `npm run lint` | `oxlint` | Lints using `.oxlintrc.json`. |

---

## Architecture

### Project Layout

```
├── server/
│   ├── db.ts                  # SQLite connection, schema DDL, idempotent seed data
│   └── index.ts               # Express app + all API routes
├── src/
│   ├── main.tsx               # React entry
│   ├── App.tsx                # Root component; all app state lives here
│   ├── types/index.ts         # TrainingMode, CommunicationMetrics, Session, UserProfile, ...
│   ├── services/
│   │   ├── api.ts             # API client (hardcoded base URL + local fallbacks)
│   │   ├── aiCoachService.ts  # Gemini call + heuristic fallback engine
│   │   └── speechService.ts   # SpeechTracker: Web Speech API + Web Audio volume meter
│   └── components/
│       ├── layout/Navbar.tsx
│       ├── dashboard/Dashboard.tsx
│       ├── modes/             # ModesHub + 8 mode components
│       ├── analytics/         # GitHubHeatmap, MonthlyJourney, PersonalProfile
│       ├── storybank/StoryBank.tsx
│       └── session/           # SessionComplete, SessionReplayPlayer
├── index.html
├── vite.config.ts             # plugins only — no proxy, no port override
└── tailwind.config.js         # legacy; the v4 @theme block in src/index.css is authoritative
```

**No router.** `src/App.tsx` is a single component holding state; navigation is a
`useState<ActiveTab>` string union defined in `Navbar.tsx:14`. There is also no Redux, Zustand, or
Context — just lifted `useState` hooks.

### Backend API

Express 5, fully open `cors()`, `express.json()`, port `3001`. Every handler is wrapped in
try/catch and returns `500 { error }` on failure.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/profile` | Single-row profile, snake_case → camelCase. `404` if absent. |
| `GET` | `/api/analytics/daily-activity` | All `daily_activity` rows, `date ASC`. |
| `GET` | `/api/analytics/monthly-reports` | All `monthly_reports`, `year_month ASC`; parses `category_scores_json`. |
| `GET` | `/api/stories` | Story bank, `last_practiced_at DESC`; parses themes/emotions/interview-use-case JSON. |
| `POST` | `/api/stories` | Upsert (`ON CONFLICT(id) DO UPDATE`), auto-id `story-${Date.now()}`. Also increments `user_profile.total_stories_practiced`. |
| `DELETE` | `/api/stories/:id` | Delete one story. |
| `GET` | `/api/sessions` | Last **20** sessions, `timestamp DESC`; parses 5 JSON columns. |
| `GET` | `/api/sessions/:id` | One session. `404` if not found. |
| `POST` | `/api/sessions` | Insert, then run profile roll-ups (see below). |
| `DELETE` | `/api/sessions/:id` | Delete one session. |
| `POST` | `/api/profile/clear-history` | Wipes `sessions` and zeroes all three profile totals. |

`POST /api/sessions` has three side effects (`server/index.ts:237`):

1. **Exponential moving average** on the profile score:
   `current_overall_score = ROUND(current * 0.9 + new * 0.1, 1)`
2. Upserts today's `daily_activity` row, averaging `daily_score` as `(old + new) / 2.0`
3. Increments `total_sessions` and adds to `total_practice_minutes`

### Database Schema

`better-sqlite3`, file at `path.resolve(process.cwd(), 'communication_agent.db')`, `journal_mode = WAL`.

> The path is **relative to the current working directory**, so the server must always be started
> from the repo root.

Five tables, all created with `CREATE TABLE IF NOT EXISTS`:

| Table | Purpose | Key columns |
| --- | --- | --- |
| `user_profile` | Single-row global profile | `id` (always 1), `name`, `current_overall_score`, `starting_score`, `strongest_skill`, `biggest_improvement`, `current_weakness`, `recurring_pattern`, `natural_strength`, `developing_skill`, `current_focus`, `recommended_next_step`, `streak_days`, `total_sessions`, `total_practice_minutes`, `total_stories_practiced`, `practice_consistency_pct` |
| `daily_activity` | Heatmap source | `date` (PK, `YYYY-MM-DD`), `minutes_practiced`, `sessions_count`, `exercises_count`, `daily_score`, `best_moment`, `focus_area` |
| `monthly_reports` | Monthly progress | `year_month` (PK, `YYYY-MM`), `month_name`, `overall_score`, `score_change`, `category_scores_json`, `biggest_improvement`, `biggest_weakness`, `recurring_habit`, `next_month_focus` |
| `story_bank` | Raw vs. polished stories | `id` (PK), `title`, `raw_version`, `polished_version`, `core_conflict`, `turning_point`, `lesson`, `themes_json`, `emotions_json`, `interview_use_cases_json`, `practice_count`, `last_practiced_at` |
| `sessions` | Practice history | `id` (PK), `timestamp`, `mode`, `mode_label`, `duration_seconds`, `context_prompt`, `target_audience`, `transcript`, `score`, `utterances_json`, `metrics_json`, `replays_json`, `why_coaching_json`, `attempt_number`, `previous_attempt_id`, `deltas_json`, `one_thing_to_practice` |

#### Seed data

`seedDefaultData()` (`server/db.ts:105`) runs on every boot and is **idempotent** — each insert is
guarded by a `COUNT(*)` check, so existing data is never overwritten. A fresh database is seeded with:

- Profile `Rohan`, score **7.6** (from 5.4), 18-day streak, 47 sessions, 872 minutes
- **5 monthly reports**, `2026-05` → `2026-09`, scores climbing 5.4 → 7.6
- **90 days** of `daily_activity` ending `2026-09-27`
- **2 stories:** "The 3 AM Production Outage" and "Explaining RAG to a Skeptical CFO"
- **1 demo session** `sess-demo-1` (Storytelling, 112s, score 7.6) with full metrics, 3 replay markers,
  and 2 coaching cards

To reset everything, delete the database file and restart the server:

```bash
rm communication_agent.db communication_agent.db-shm communication_agent.db-wal
npm run server
```

### Training Modes

Eight modes, reachable from the Modes tab. Each follows the same loop:
`SpeechTracker.start()` → 1s timer → stop → `evaluateSession()` → build a `Session` → `onSessionComplete()`.

| Mode | Behavior |
| --- | --- |
| **Live Coach** | Richest mode. Opens camera + mic, renders a mirrored video with a real-time HUD: pace (WPM), filler-word spikes, engagement indicator, volume meter, and a live transcript stream. |
| **Conversation** | Multi-turn chat roleplay. Replies are drawn from a small hardcoded pool with an 800 ms simulated delay. |
| **Storytelling** | 4 challenge prompts. Supports retry attempts — re-runs the same prompt and produces deltas vs. the previous try. |
| **Public Speaking** | Editable pitch prompt plus a simulated "Audience State" that flips to *Highly Engaged* once you start talking. |
| **Interview** | 3 questions: hiring pitch, a technical mistake, disagreeing with a manager. |
| **Spontaneous Agility** | 4 surprise prompts, a "Surprise Me" randomizer, and a 5-second prep countdown that auto-starts recording. |
| **Explain It Simply** | 3 audience levels: 10-year-old child, non-technical CFO, non-tech CEO. |
| **Daily Workout** | Orchestrator for a ~8-minute circuit: 60s story hook → 60s explain-simply → 45s spontaneous → 30s weak-area repeat. Delegates to the mode components above and averages step scores. |

If a transcript comes back empty, each mode substitutes a hardcoded sample so the flow still
completes.

### AI Evaluation Pipeline

`evaluateSession()` in `src/services/aiCoachService.ts` returns:

- `score` — 0.0 to 10.0
- `metrics` — 14 numeric communication metrics
- `replays` — timestamped timeline markers
- `whyCoaching` — observation → impact, the underlying principle, and an exemplar reframing
- `oneThingToPractice` — a single concrete focus
- `deltas` — 6 percentage fields, present only on retry attempts

When a key is available it calls **`gemini-2.5-flash`** via `models.generateContent()`
(`aiCoachService.ts:102`). The prompt requests a specific raw-JSON shape; the response has
`` ```json `` fences stripped before `JSON.parse`.

### Speech Tracking

`speechService.ts` combines two browser APIs:

- **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`) — `continuous: true`,
  `interimResults: true`, `lang: 'en-US'`
- **Web Audio API** — an `AnalyserNode` (`fftSize = 256`) over `getUserMedia`, polled with
  `requestAnimationFrame` for the live volume meter

Derived in-browser: filler-word count via regex
(`um|uh|like|basically|you know|honestly|sort of|kind of`) and words-per-minute.

---

## Development Notes

**Current charts.** Only one Recharts usage exists: a single `AreaChart` in `MonthlyJourney.tsx:4`
plotting overall score vs. storytelling score. Everything else that looks like a chart is hand-built
CSS — the heatmap is a 154-cell CSS grid, and volume/pace/score indicators are divs.

**Frontend talks to the backend cross-origin.** `src/services/api.ts:3` hardcodes
`const API_BASE = 'http://localhost:3001/api'` and `vite.config.ts` defines no proxy. That is why
CORS is fully open on the Express server. If you change the backend port, update `API_BASE` too.

**The server is outside the TypeScript project.** Neither `tsconfig.app.json` (which includes only
`src`) nor `tsconfig.node.json` (which includes only `vite.config.ts`) covers `server/`. It is never
type-checked by `npm run build` and only ever runs through `tsx`, which strips types without
checking them.

**Tailwind v4.** Configuration lives in the `@theme` block in `src/index.css:3`. `tailwind.config.js`
still exists and defines identical values, but without a `@config` directive it is not loaded.

**Linting.** Oxlint, not ESLint. Type-aware rules are not enabled; to turn them on, install
`oxlint-tsgolint` and set `options.typeAware` in `.oxlintrc.json`.

**Known hardcoded demo values** — useful to know before you trust a number on screen:

- The date `2026-09-27` is pinned in three places: `server/db.ts:203`, `src/services/api.ts:48`, and
  `src/components/analytics/GitHubHeatmap.tsx:19`. The heatmap is a fixed window, not a rolling one.
- Dashboard "Monthly Progress +0.8" and "↑ Storytelling +18%" are literal strings
  (`Dashboard.tsx:88`).
- `DELETE /api/sessions/:id` exists server-side and `api.deleteSession` is defined client-side, but
  nothing in the UI calls it.
- The replay player's play/pause toggle is cosmetic — no audio is stored or played, and `isPlaying`
  is not driven by a timer.
- `clsx` and `tailwind-merge` are declared dependencies but never imported. There is no `cn()`
  helper. Both can be removed.

**Secrets.** `.env` and the SQLite files are gitignored; `.env.example` is the tracked template.
See [Secret handling](#secret-handling).

---

## Troubleshooting

**"No results for action" or the mic does nothing in the UI**
The Web Speech API is Chromium-only. Use Chrome or Edge, and check that the page is served over
`http://localhost` or HTTPS — `file://` and plain HTTP on a LAN IP will both fail the permission
prompt.

**Frontend loads but every number is demo data**
The API is unreachable. `api.ts` silently swallows errors and returns local fallback data, so a dead
backend looks like a working app with fake numbers. Check that `npm run server` is running and that
`API_BASE` in `src/services/api.ts:3` matches the backend port.

**Backend starts but the dashboard is empty**
`better-sqlite3` resolves the DB path against `process.cwd()`. If you launched the server from
outside the repo root, a new empty database is created elsewhere and the seed data lands in the wrong
file. Always run `npm run server` from the repo root.

**Gemini call fails / scores look heuristic**
`evaluateSession()` logs `Gemini API call failed, falling back to Intelligent Mock Engine` to the
browser console and silently uses the local engine. Usual causes: key not prefixed with `VITE_`,
key invalid, or the request shape was rejected. Restart `npm run dev` after editing `.env` — Vite
only re-reads env vars on start.

**`better-sqlite3` fails to install**
It is a native module and needs prebuilt binaries or a C++ toolchain. On Windows, confirm Node
20+ and that your architecture matches the binary; if in doubt, `npm rebuild better-sqlite3`.

**Port already in use**
Change `PORT` in `.env` for the backend, and update `API_BASE` in `src/services/api.ts:3` to match.
For the Vite port, add a `server.port` field to `vite.config.ts`.
