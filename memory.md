# Memory — Profile Page UI

Last updated: 2026-08-19 20:55 EDT

## What was built

- Completed Feature 05 Profile Page — Full UI with mock data only.
- Added protected `app/profile/page.tsx`.
- Added profile UI components:
  - `components/profile/CompletionIndicator.tsx`
  - `components/profile/ProfileAttentionBanner.tsx`
  - `components/profile/ResumeUpload.tsx`
  - `components/profile/ProfileForm.tsx`
- Updated `components/layout/Navbar.tsx` so `Dashboard`, `Find Jobs`, and `Profile` remain visible at narrow widths and the active route is highlighted.
- Updated auth redirect handling:
  - `actions/auth.ts`
  - `app/(auth)/callback/route.ts`
  - `app/(auth)/login/page.tsx`
  - `components/auth/LoginForm.tsx`
  - `lib/auth-constants.ts`
  - `lib/auth-redirects.ts`
  - `proxy.ts`
- Updated `C:\Users\gomes\Downloads\context\context\ui-registry.md` for the profile components and revised navbar pattern.
- Updated `C:\Users\gomes\Downloads\context\context\progress-tracker.md` to mark Feature 05 complete and set Feature 06 as next.

## Decisions made

- Feature 05 remains UI-only: no profile save logic, resume upload behavior, AI extraction, or resume PDF generation yet.
- Profile UI uses project tokens and the standard white card treatment from the design.
- Navbar stays top-navbar-only; narrow widths use a stacked top nav row instead of a drawer/sidebar.
- OAuth `redirectTo` must remain the exact allowed `/callback` URL for InsForge. Protected-route `next` paths are stored in a short-lived httpOnly cookie instead of being appended to the callback URL.

## Problems solved

- Profile route was not reachable from the navbar at narrow widths because nav links were hidden below `md`; fixed by keeping the route links visible.
- Protected-route auth redirects originally returned users to `/dashboard`; fixed so safe internal `next` paths can return users to `/profile`.
- OAuth started failing with “Could not start sign in” because `redirectTo` included `?next=...`, which InsForge rejected as not allowlisted; fixed by moving `next` into a cookie while restoring the exact `/callback` redirect URL.

## Current state

- Dev server is running at `http://localhost:3000`.
- `/profile` renders the mock profile page and is protected.
- Navbar shows `Dashboard`, `Find Jobs`, and `Profile` at the current narrow browser width; `Profile` is active on `/profile`.
- `npm run lint` passed after the profile UI and auth/navbar fixes.
- ReadLints reported no diagnostics on the edited files.
- OAuth start should no longer be blocked by the redirect URL allowlist issue; provider sign-in should be manually verified if not already retried after the cookie fix.

## Next session starts with

Run `/remember restore`, then start Feature 06 Profile Save Logic. Follow the project read order from `AGENTS.md`, load the relevant InsForge skill before writing database/storage code, and wire the profile form to `profiles` plus resume upload to the private `resumes` bucket.

## Open questions

- What is the deployed app URL for production OAuth callbacks?
- Are Google and GitHub OAuth provider credentials configured in the InsForge dashboard?
- Are valid PostHog public key and host values configured in deployment env?
- Does InsForge expose bucket-level per-user object policies beyond private bucket access, or should resume access rely on the private bucket plus app/database-enforced `{user_id}/resume.pdf` key contract?
