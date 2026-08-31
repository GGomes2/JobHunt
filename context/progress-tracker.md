# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 2 — Profile Page
**Last completed:** 06 Profile Save Logic
**Next:** 07 AI Profile Extraction from Resume

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Homepage CTAs and Start for Free link to `/login` until auth is built (build plan: unauthenticated → login).
- Logo rendered as gradient icon + text rather than `logo.png` (source asset has a black background unsuitable for the white navbar).
- Public images copied from Downloads `public/public` into `jobpilot/public`.
- Auth uses `@insforge/sdk` SSR helpers from the latest InsForge docs instead of the older `@insforge/ssr` context snippet.
- OAuth starts from server actions, stores the PKCE verifier in an httpOnly cookie, exchanges `insforge_code` at `/callback`, and redirects successful sign-ins to `/dashboard`.
- Next.js 16 route protection uses `proxy.ts` instead of deprecated `middleware.ts`.
- InsForge auth config now allows the local OAuth callback URL: `http://localhost:3000/callback`.
- Review fixes added safe exception handling around auth actions/routes, documented required env vars in `.env.example`, and resolved the npm audit finding.
- PostHog initialization uses manual `$pageview` capture with `capture_pageview: false`, matching project docs.
- Auth tracking events added: `oauth_sign_in_started`, `oauth_sign_in_completed`, and `sign_out_clicked`.
- PostHog calls no-op when `NEXT_PUBLIC_POSTHOG_KEY` or `NEXT_PUBLIC_POSTHOG_HOST` is missing, so local auth still works before analytics keys are added.
- OAuth callback landings with `?auth=success` are excluded from manual `$pageview` tracking before the URL is cleaned to avoid double-counting dashboard pageviews.
- Database schema lives in InsForge migration `20260813220438_create-jobpilot-schema.sql` and has been applied to the linked `JSM_JobHunt` backend.
- Feature 04 created `profiles`, `agent_runs`, `jobs`, and `agent_logs` with user-scoped RLS, no anonymous table access, no authenticated delete grants, append-only agent logs, and narrow column-level update grants.
- `jobs` uses only the concrete columns from `architecture.md`; speculative resume tailoring or cover-letter fields were intentionally skipped because those features are out of scope.
- `profiles` stores both `resume_pdf_url` and `resume_pdf_key` so later storage operations can use the InsForge object key as well as the URL.
- A private InsForge storage bucket named `resumes` now exists for the active resume PDF.
- Review fixes live in InsForge migration `20260813222440_harden-jobpilot-schema.sql` and have been applied to the linked backend.
- The schema now blocks authenticated inserts into derived/system fields such as timestamps, run status/counts, `jobs.company_research`, and `profiles.is_complete`.
- `profiles.email` and `profiles.is_complete` are no longer directly updateable by authenticated users; `is_complete` is derived by a database trigger from required profile fields.
- `profiles.resume_pdf_key` is constrained to `{user_id}/resume.pdf`, matching the private `resumes` bucket ownership path used by later resume uploads.
- Feature 05 built `/profile` as a protected mock-data UI only; save logic, resume upload behavior, AI extraction, and PDF generation remain intentionally deferred to Features 06-08.
- Profile UI is split into `ProfileAttentionBanner`, `CompletionIndicator`, `ResumeUpload`, and `ProfileForm` components, all using project tokens and the standard white card treatment from the design.
- Navbar now highlights the active route using `usePathname()` with color-only active state, matching the project navbar rule.
- Review fix: Navbar route links remain visible on narrow widths with a top-navbar-only stacked nav row, so Profile is always reachable without adding a drawer/sidebar.
- Review fix: Auth preserves safe internal `next` paths through `/login` using a short-lived httpOnly cookie, keeping InsForge OAuth `redirectTo` fixed at the allowed `/callback` URL while returning users to `/profile` after sign-in.
- Feature 06 loads the signed-in user's `profiles` row on `/profile`, pre-fills from that row or auth email/name, and saves through `actions/profile.ts`.
- Resume PDFs upload in the browser with `createBrowserClient()` to `resumes/{user_id}/resume.pdf`; the save action writes `resume_pdf_url` and `resume_pdf_key`. Generate Resume and extract remain unwired.
- Completion percent and missing tags are computed live in the client from the same required fields as the `is_complete` trigger. The app never writes `is_complete` or `email` on update. `profile_completed` fires the first time the saved row becomes complete.

---

## Notes

- Landing assets in use: `/images/dashboard-demo.png`, `/images/jobs-lists.png`, `/images/agnet-log.png`, `/images/user-icon.png`.
