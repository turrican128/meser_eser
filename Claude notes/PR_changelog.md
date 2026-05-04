# PR Changelog

A running log of pull requests on `https://github.com/turrican128/meser_eser`. Newest first.

---

## PR #2 — Sales-demo visual overhaul *(in progress on `feature/sales-demo-redesign`)*

**Goal:** make the page feel like an editorial spread instead of a generic Tailwind template, in time for the demo to the CRM owner.

**What changed:**
- **Editorial aesthetic** — committed to a "boutique magazine" direction: warm cream foundation, deep ink text, single terracotta accent, hairline borders, section numbering (`01 — 04`), generous whitespace.
- **Real Hebrew display font** — added `Frank Ruhl Libre` (Hebrew serif) for headlines + `Heebo` (sans) for body via Google Fonts. Loaded in [index.html](../index.html).
- **Refined `@theme` palette** in [src/index.css](../src/index.css) — replaced wall-to-wall purple `brand-*` scale with a terracotta scale; introduced cream/ink/line neutral tokens; added `fade-up`, `fade-in`, `draw-line` keyframe animations.
- **`LandingPage.jsx` rewritten** as five composed sections (`SiteHeader`, `Hero`, `Benefits`, `CtaBand`, `ContactSection`, `SiteFooter`) — asymmetric editorial hero with image bleed, decorative corner accent, owner-name plate.
- **`FeatureCard.jsx`** — dropped the emoji `icon` prop; now uses a serif numeral (01, 02, …) and a hairline divider that animates on hover.
- **`LeadForm.jsx`** — flat editorial card; bottom-border-only inputs with Latin micro-labels above each field; black submit button matching the hero CTA. Logic and validation untouched.
- **`SmartImage.jsx`** — error fallback rebuilt as cream + terracotta hairline composition (matches the new aesthetic, no more purple gradient).
- **Image source switched from AI to curated Unsplash** ([src/services/imageFinder.js](../src/services/imageFinder.js)) — 16 categories × 3 photos each, deterministic per-contact via djb2 hash. **Fixed the Hebrew-stripping regex bug** that was making every Hebrew business produce the same generic prompt.
- **`?mock=<name>`** still auto-discovers `*.json` in `src/json-input-demos/` (unchanged).

**Verification:** lint clean, build clean, all 48 Unsplash URLs verified `200 OK`. Three demos (`?mock=cafe|yoga|tech`) each render distinctly.

**Status:** awaiting visual sign-off before commit + PR.

---

## PR #1 — Drive landing page from server `CreateContact` JSON *(merged 2026-05-01, commit `3463a08`)*

**Goal:** replace the local "builder" page with a server-driven landing page. Each landing page now corresponds to a contact in the CRM and is rendered from its JSON.

**What changed:**
- **Removed** `src/pages/BuilderPage.jsx` and `src/context/BuilderContext.jsx` — no more local form, no more localStorage persistence.
- **Added [src/services/api.js](../src/services/api.js)** — `apiCall`, `getContact`, `createContact`. POSTs to `https://heb.mesereser.com/Services/JsonServices.aspx?f=<FunctionName>` with `ApiKey` header. Throws `ApiConfigError` when the env var is missing (which `useContact` translates to a generic Hebrew message instead of leaking the var name).
- **Added [src/hooks/useContact.js](../src/hooks/useContact.js)** — `useContact(id)` returns `{ contact, loading, error }`. Uses the React 19 setState-during-render "tracker" pattern to satisfy the `set-state-in-effect` lint rule.
- **Added [src/json-input-demos/](../src/json-input-demos/)** — fixture JSONs auto-discovered via `import.meta.glob`. `?mock=<name>` loads `<name>.json` instead of the CRM. Gated on `import.meta.env.DEV` and **dynamically imported**, so fixtures don't ship in the production bundle.
- **`LandingPage.jsx`** — reads `?id=` from query, calls `useContact`, maps `CustomField1-5` + name + email into the existing UI. Adds loading / error / missing-id branches.
- **`LeadForm.jsx`** — split into `FirstName/LastName`, POSTs the standard `CreateContact` payload, inline status messages instead of `alert()`.
- **`SmartImage.jsx`** — refactored to React 19's "src-tracker" pattern.
- **Added [WHAT-WE-NEED-TO-RUN.md](../WHAT-WE-NEED-TO-RUN.md)** — handoff spec for the CRM developer (call shape, headers, response envelope, CORS, the open `GetContact` function-name question).
- **Added [CLAUDE.md](../CLAUDE.md)** — architecture notes for future sessions.

**Code review:** an independent review found 7 issues. **3 critical** were fixed before merge: (1) static `json-input-demos` import would have shipped fixtures into prod — switched to dynamic; (2) missing API key surfaced English dev-speak in Hebrew UI — caught and translated; (3) `WHAT-WE-NEED-TO-RUN.md` test scenario said `GET` but app uses `POST`. **3 carry-over items** scheduled for cleanup PR on 2026-05-15: `createContact` return-shape consistency, `getDemo` empty-folder guard, Israeli phone format validation.

**Test plan ran:** `npm run lint` passed, `npm run build` produced clean `dist/`, three mock demos rendered correctly, force-push to remote replaced the obsolete TypeScript scaffold (commit `b20af78`, recoverable for ~90 days).

---

## Pre-history

- **`b20af78` (overwritten 2026-05-01)** — original TypeScript scaffold (`server.ts`, `App.tsx`, etc.). Force-pushed away to make room for the JS rewrite. Recoverable from GitHub reflog if needed.
- **`54df073`** — initial JS commit (the codebase as it existed before PR #1).
