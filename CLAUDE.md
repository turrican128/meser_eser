# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

No test runner is configured.

## Environment

- `VITE_MESERESER_API_KEY` — required at runtime. Put it in `.env.local` (gitignored). See `.env.example`. The dev server must be restarted after editing `.env.local`.

## Mock mode

Append `?mock=<demoName>` to any landing URL and `src/services/api.js` will skip the network and return the fixture from `src/json-input-demos/<demoName>.json`. `?mock=1` (without a name) loads the default demo (`DEFAULT_DEMO` in `src/json-input-demos/index.js`).

Mock mode is **always on in `npm run dev`**. In production builds it's gated on `VITE_ALLOW_MOCK=1` — leave that var unset for real deployments (fixtures are tree-shaken out) and set it only on demo deploys that have no real CRM credentials yet.

Examples:
- `http://localhost:5173/landing?id=demo&mock=1` — default demo
- `http://localhost:5173/landing?id=demo&mock=cafe` — `cafe.json`
- `http://localhost:5173/landing?id=demo&mock=tech` — `tech.json`

To add a new demo: drop a `.json` file into `src/json-input-demos/`. `import.meta.glob` picks it up automatically — no registration needed. The file must match the `CreateContact` JSON shape (FirstName, LastName, EMail, PhoneNo, Address, City, Zipcode, ContactListName, CustomField1–5).

In mock mode `createContact` is also stubbed; it just logs the payload to the console and returns success. Mock mode is gated on `import.meta.env.DEV`, so production builds physically cannot enter it even if `?mock=...` is in the URL.

## Architecture

A single-page Hebrew (RTL) landing page rendered from server data. JavaScript only (no TypeScript). React 19 + Vite 8 + Tailwind v4 + react-router-dom v7.

### Flow

1. Visitor opens `/landing?id=<contactId>`.
2. `LandingPage` reads `id` from the query string and calls `useContact(id)`, which hits the Meser Eser CRM and returns a `CreateContact`-shape JSON.
3. The page maps the JSON into the existing layout: banner, hero (with optional AI-expanded copy), benefits grid, CTA, lead form, footer.
4. The on-page `LeadForm` POSTs *new* visitor leads back to the same CRM via `CreateContact` — so the same JSON shape flows in both directions.
5. `/` and any unknown route redirect to `/landing` (which shows a Hebrew "missing id" message if no `id` is present).

### API

- Base: `https://heb.mesereser.com/Services/JsonServices.aspx?f=<FunctionName>`
- Header: `ApiKey: <VITE_MESERESER_API_KEY>`
- Response envelope: `{ ErrorCode, Result }` — `ErrorCode === "0"` is success; otherwise `Result` carries the error message
- Wrapped in `src/services/api.js`. The fetch-side function name is in `GET_CONTACT_FN` and **needs to be confirmed** against the API docs (currently `'GetContact'`).

### Field mapping (JSON → page)

| JSON field | Page use |
|---|---|
| `CustomField1` | banner name (top strip) |
| `CustomField2` | business text → fed to `textExpander` for headline/intro/benefits/cta |
| `CustomField3` | image URL (if empty, `imageFinder.buildImageUrl` builds one from `CustomField2` + `CustomField4`) |
| `CustomField4` | image category (key in `imageFinder.IMAGE_CATEGORIES`) |
| `CustomField5` | owner email shown in footer + mailto |
| `FirstName` + `LastName` | owner display name |
| `EMail` | fallback for owner email when `CustomField5` is empty |

### Styling

Tailwind v4 via `@tailwindcss/postcss` (`postcss.config.js`). There is **no `tailwind.config.js`** — the brand color palette (`brand-50`–`brand-900`) is declared in `src/index.css` inside `@theme { ... }` using CSS variables, the v4 way. Add new design tokens there, not in a JS config file.

The app is RTL-first: `index.html` sets `dir="rtl" lang="he"`. In two-column hero/lead sections, `order-1`/`order-2` reverses visually under RTL.

### Things to know before editing

- `src/services/textExpander.js` is **not an LLM call** — it picks from hardcoded Hebrew templates and substitutes a keyword from `CustomField2`. To wire real AI, replace this module's `expandText` implementation.
- `src/services/imageFinder.js` only runs as a fallback when `CustomField3` is empty; it builds a `pollinations.ai` URL.
- All user-facing strings are Hebrew. Keep new UI text in Hebrew unless asked otherwise.
- The remote `https://github.com/turrican128/meser_eser` was force-pushed from local on 2026-05-01; the previous TypeScript version on `main` was overwritten (still recoverable by SHA `b20af78` for ~90 days).
