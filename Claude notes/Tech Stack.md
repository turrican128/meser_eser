# Tech Stack

A snapshot of every moving part in this project, why it's there, and where to find the relevant config.

## Runtime & build
| Piece | Version | Why |
|---|---|---|
| **React** | 19.2 | UI framework; uses the React 19 `set-state-in-effect` lint rule (see `useContact.js` and `SmartImage.jsx` for the "tracker" pattern that satisfies it) |
| **Vite** | 8.0 | Dev server + production bundler. Picks up `VITE_*` env vars and inlines them into the bundle at build time |
| **react-router-dom** | 7.x | Client-side routing for the two routes (`/landing`, catch-all redirect) |
| **JavaScript** | — | Plain `.jsx` / `.js` — **no TypeScript**. Don't add it without a discussion (the previous TS version was force-pushed away on 2026-05-01) |

## Styling
| Piece | Why |
|---|---|
| **Tailwind v4** (`@tailwindcss/postcss`) | Utility CSS. **No `tailwind.config.js`** — design tokens live in `src/index.css` inside `@theme { ... }` using CSS custom properties (the v4 way) |
| **PostCSS + autoprefixer** | Required by Tailwind v4 |
| **Frank Ruhl Libre** (Google Fonts) | Hebrew display serif — the visual signature of the editorial redesign. Loaded via `<link>` in `index.html` |
| **Heebo** (Google Fonts) | Hebrew sans-serif body font. Same loader |

## Data & API
| Piece | Why |
|---|---|
| **Meser Eser CRM** | The data source. Base URL `https://heb.mesereser.com/Services/JsonServices.aspx?f=<FunctionName>`. Authed via `ApiKey` header. Response shape `{ ErrorCode, Result }` |
| **`fetch` (browser-native)** | No Axios; `src/services/api.js` is a small hand-rolled client (~80 lines) |
| **`import.meta.glob`** | Vite feature. Auto-discovers every `*.json` in `src/json-input-demos/` so dropping a new fixture file makes it instantly available as `?mock=<name>` |
| **Unsplash CDN** (`images.unsplash.com`) | Hero images. Hand-curated photo IDs per business category in `src/services/imageFinder.js`. Deterministic per-contact via a tiny djb2 hash on the banner name |

## Tooling
| Piece | Version | Why |
|---|---|---|
| **ESLint** | 10.x | `npm run lint`. Uses `eslint-plugin-react-hooks` 7.x (which enforces the React 19 rules) |
| **No test runner** | — | Intentional for now. Add Vitest only if the codebase grows enough to need it |
| **gh CLI** | — | Used for PR workflow (`gh pr create`, `gh pr merge`) |

## What's NOT here (and why)
| Not used | Reason |
|---|---|
| TypeScript | Plain JS chosen; reverting would be deliberate |
| State manager (Redux, Zustand) | Component state + URL params are enough |
| React Query / SWR | One fetch call per page; a 35-line `useContact` hook is simpler |
| Backend / API server | The browser calls the CRM directly. If we ever switch to "CRM pushes data to us" (Option 2 in our architecture discussion), we'd need to add one |
| AI image generation | Replaced with curated Unsplash. The previous pollinations.ai integration had a Hebrew-stripping regex bug |
| `tailwind.config.js` | Tailwind v4 puts theme tokens in CSS, not JS |

## Environment variables
| Var | Purpose |
|---|---|
| `VITE_MESERESER_API_KEY` | The CRM API key. Set in `.env.local` (gitignored). **Inlined into the production bundle** — anyone reading the JS source can extract it |

## Hosting
Not yet decided. Static-hosting candidates that work out-of-the-box: Vercel, Netlify, Cloudflare Pages, GitHub Pages. Build output is `dist/` (CSS ~23 kB, JS ~257 kB, gzip ~82 kB).
