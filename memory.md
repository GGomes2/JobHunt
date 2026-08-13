# Memory — Database Schema Foundation

Last updated: 2026-08-13 18:31 EDT

## What was built

- Completed Feature 04 Database Schema on the linked InsForge backend.
- Created and applied `migrations/20260813220438_create-jobpilot-schema.sql` with:
  - `profiles`
  - `agent_runs`
  - `jobs`
  - `agent_logs`
  - constraints, indexes, triggers, grants, and user-scoped RLS policies
- Created the private InsForge storage bucket `resumes`.
- Ran `/review` for Feature 04 and resolved the findings with `migrations/20260813222440_harden-jobpilot-schema.sql`.
- Updated `C:\Users\gomes\Downloads\context\context\progress-tracker.md` to mark Feature 04 complete and set Feature 05 as next.

## Decisions made

- Keep `jobs` limited to the concrete columns from `architecture.md`; do not add speculative tailoring or cover-letter fields.
- Keep runtime deletes disabled for the four schema tables until a future feature explicitly needs delete/dismiss/history cleanup.
- Keep `agent_logs` append-only for authenticated runtime access.
- Store both `resume_pdf_url` and `resume_pdf_key` on `profiles`.
- Constrain `profiles.resume_pdf_key` to `{user_id}/resume.pdf` for the private `resumes` bucket path.
- Derive `profiles.is_complete` in the database from required profile fields instead of letting clients set it directly.
- Do not let authenticated users directly update `profiles.email` or `profiles.is_complete`.
- Use column-scoped insert grants so authenticated clients cannot provide derived/system fields such as timestamps, run status/counts, `jobs.company_research`, or `profiles.is_complete`.

## Problems solved

- The initial schema allowed broad authenticated inserts; review found that clients could spoof derived/system fields. Fixed in the hardening migration.
- The initial schema allowed direct updates to `profiles.email` and `profiles.is_complete`. Fixed by revoking those update grants and adding the completion trigger.
- The initial storage setup only had a private bucket. Added a database constraint so stored resume keys must match the current user's owned resume path.
- The applied migration history is preserved: fixes were added in a second migration instead of editing already-applied migration SQL.

## Current state

- Both database migrations are applied to the linked InsForge backend.
- `profiles`, `agent_runs`, `jobs`, and `agent_logs` exist with RLS enabled.
- `resumes` bucket exists and is private.
- Verification confirmed:
  - hardening migration is applied
  - resume key constraint exists
  - profile completion trigger exists
  - protected derived insert columns return zero authenticated insert grants
  - `profiles.email` and `profiles.is_complete` return zero authenticated update grants
- ReadLints found no diagnostics for the edited migration/progress files.
- `memory.md` has now been updated for this session.

## Next session starts with

Start Feature 05 Profile Page — Full UI. Before building, run `/remember restore`, then follow the project read order from `AGENTS.md` and use the profile design image in `C:\Users\gomes\Downloads\context\context\designs\profile.png`.

## Open questions

- What is the deployed app URL for production OAuth callbacks?
- Are Google and GitHub OAuth provider credentials configured in the InsForge dashboard?
- Are valid PostHog public key and host values configured in deployment env?
- Does InsForge expose bucket-level per-user object policies beyond private bucket access, or should resume access rely on the private bucket plus app/database-enforced `{user_id}/resume.pdf` key contract?
