# Plans & Future Enhancements

Things we know need doing, in roughly increasing scope. Not all of these are committed — most are options to weigh against priorities.

## Already scheduled

### Cleanup PR — auto-fires 2026-05-15 at 12:00 Asia/Jerusalem
A scheduled remote agent ([trig_01UQuumN2wtiKEswYpDHuX8M](https://claude.ai/code/routines/trig_01UQuumN2wtiKEswYpDHuX8M)) will open a small cleanup PR addressing the three carry-over items from PR #1's review:
- **`createContact` return-value consistency** — make the live-API path return `data.Result` (matching `getContact`) instead of the full `{ ErrorCode, Result }` envelope.
- **`getDemo` empty-folder guard** — throw an explicit error if `src/json-input-demos/` is empty (today it silently returns `undefined`, which gets spread into a contact object).
- **Israeli phone format validation** in `LeadForm.jsx` — regex `/^0\d{1,2}-?\d{7}$/` with a Hebrew error message.

The agent self-merges only if `npm run lint` and `npm run build` both pass.

## Open questions awaiting the CRM developer

These block a real production deployment but not the demo:

1. **`GetContact` function name** — `src/services/api.js:4` has `GET_CONTACT_FN = 'GetContact'` as a guess. The CRM doc you have only describes `CreateContact`. The CRM dev needs to confirm the exact function name and request body shape (`{ Id }` vs `{ ContactId }` vs something else) — see [WHAT-WE-NEED-TO-RUN.md](../WHAT-WE-NEED-TO-RUN.md).
2. **CORS** — without `Access-Control-Allow-Origin` headers from the CRM for our deployed origin, the browser will block every call. Send the dev the spec section in `WHAT-WE-NEED-TO-RUN.md`.
3. **API-key exposure model** — `VITE_MESERESER_API_KEY` is currently inlined into the JS bundle and visible in browser DevTools. Acceptable if the key is per-customer and easy to rotate; not acceptable if it grants broad access. CRM dev to confirm.

## Architectural decisions still pending

### Option 1 vs Option 2 (data-flow direction)

What's built today is **Option 1** — the visitor's browser pulls from the CRM:

```
Visitor → Browser → CRM (GetContact) → JSON → page rendered
```

If the CRM doesn't expose a read endpoint (only `CreateContact`), we'd need **Option 2** — the CRM operator's system pushes contact data to a tiny backend we'd add:

```
CRM operator → CRM webhook → Our backend → /landing/abc123 (URL handed to visitor)
```

Option 2 means adding ~1–2 hours of backend work: a Node/Express function (or a single Vercel/Cloudflare function) accepting `POST /landing-pages` with the JSON, storing it in a small DB or even a JSON file, and returning a unique URL. The current `useContact` hook would change to fetch from `/api/landing-pages/:id` instead of the CRM directly.

**Decision needed once we hear from the CRM dev** about whether `GetContact` exists.

### Production hosting & API-key proxy
If we go Option 1 and ship publicly, we should put a **server-side proxy** between the browser and the CRM so the API key never reaches the bundle. Cheapest path: a Cloudflare Worker (~50 lines) that takes the same `?f=...` calls and adds the `ApiKey` header server-side. The React app would then point at the Worker's origin instead of `heb.mesereser.com`.

## Possible enhancements (not scoped yet)

These are nice-to-haves, listed roughly in order of likely value:

- **SEO meta tags per landing page** — derive `<title>`, `<meta name="description">`, `og:` tags from `CustomField1` + `CustomField2`. Helps if pages get shared on social or indexed.
- **Per-category color theming** — currently every page uses the same terracotta accent. We considered (and deferred) different palettes per `CustomField4` (cafe = warm, tech = cool, fitness = bold). ~2 hours.
- **Phone-friendly responsive tuning** — the current breakpoints work but the editorial hero could be denser on mobile. Worth a pass after the demo.
- **Analytics** — drop in Plausible or a simple `fetch('/api/event')` for tracking page loads and form submits.
- **A/B testing infrastructure** — only relevant once we're shipping enough pages that small differences matter. Not yet.
- **More than one image per page** — current design has a single hero image. A "gallery" or "story strip" further down could use the rest of the curated Unsplash pool from `imageFinder.js`.
- **Owner-uploaded image flow end-to-end** — `CustomField3` already wins over the Unsplash fallback. But we never validated what happens with broken / oversized / wrong-aspect uploads. Worth hardening once real-world examples exist.
- **Lead-form prefill** — if visitor opens with `?prefill=1` the form could pre-populate from `FirstName/LastName/EMail/PhoneNo` in the contact JSON. Dangerous without auth (would let the visitor see the owner's contact info), so probably not.
- **i18n beyond Hebrew** — all UI strings are currently inlined Hebrew. Not a priority unless an English/Arabic version is requested.
- **Real test suite** — add Vitest + React Testing Library if regressions start landing. Not warranted yet.

## Things explicitly out of scope

- **Replacing `textExpander.js` with real LLM-generated copy** — would need an Anthropic key, server-side proxy, latency budget, prompt engineering. Significant. Currently the templates are good enough for the demo.
- **Replacing `imageFinder.js` with AI image generation** — we tried this (pollinations.ai) and it was the source of the "generic image" complaint. Curated Unsplash is the deliberate replacement.
- **TypeScript migration** — the previous TS version was force-pushed away on 2026-05-01. Don't reintroduce without a discussion.
- **Adding a CMS** — overkill. The CRM *is* the CMS.
