CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text,
  years_experience integer,
  skills text[] NOT NULL DEFAULT '{}'::text[],
  industries text[] NOT NULL DEFAULT '{}'::text[],
  work_experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '{}'::jsonb,
  job_titles_seeking text[] NOT NULL DEFAULT '{}'::text[],
  remote_preference text,
  preferred_locations text[] NOT NULL DEFAULT '{}'::text[],
  salary_expectation text,
  cover_letter_tone text,
  linkedin_url text,
  portfolio_url text,
  work_authorization text,
  resume_pdf_url text,
  resume_pdf_key text,
  is_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_experience_level_check CHECK (
    experience_level IS NULL OR experience_level IN ('junior', 'mid', 'senior', 'lead')
  ),
  CONSTRAINT profiles_years_experience_check CHECK (
    years_experience IS NULL OR years_experience >= 0
  ),
  CONSTRAINT profiles_work_experience_array_check CHECK (
    jsonb_typeof(work_experience) = 'array'
  ),
  CONSTRAINT profiles_education_object_check CHECK (
    jsonb_typeof(education) = 'object'
  ),
  CONSTRAINT profiles_remote_preference_check CHECK (
    remote_preference IS NULL OR remote_preference IN ('remote', 'onsite', 'hybrid', 'any')
  ),
  CONSTRAINT profiles_cover_letter_tone_check CHECK (
    cover_letter_tone IS NULL OR cover_letter_tone IN ('formal', 'casual', 'enthusiastic')
  ),
  CONSTRAINT profiles_work_authorization_check CHECK (
    work_authorization IS NULL OR work_authorization IN ('citizen', 'permanent_resident', 'visa_required')
  )
);

CREATE TABLE public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'running',
  job_title_searched text NOT NULL,
  location_searched text,
  jobs_found integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT agent_runs_status_check CHECK (status IN ('running', 'completed', 'failed')),
  CONSTRAINT agent_runs_jobs_found_check CHECK (jobs_found >= 0),
  CONSTRAINT agent_runs_completed_at_check CHECK (
    completed_at IS NULL OR completed_at >= started_at
  )
);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source text NOT NULL,
  source_url text NOT NULL,
  external_apply_url text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  salary text,
  job_type text,
  about_role text NOT NULL DEFAULT '',
  responsibilities text[] NOT NULL DEFAULT '{}'::text[],
  requirements text[] NOT NULL DEFAULT '{}'::text[],
  nice_to_have text[] NOT NULL DEFAULT '{}'::text[],
  benefits text[] NOT NULL DEFAULT '{}'::text[],
  about_company text,
  match_score integer NOT NULL,
  match_reason text NOT NULL DEFAULT '',
  matched_skills text[] NOT NULL DEFAULT '{}'::text[],
  missing_skills text[] NOT NULL DEFAULT '{}'::text[],
  company_research jsonb,
  found_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT jobs_source_check CHECK (source IN ('search', 'url')),
  CONSTRAINT jobs_match_score_check CHECK (match_score >= 0 AND match_score <= 100),
  CONSTRAINT jobs_company_research_object_check CHECK (
    company_research IS NULL OR jsonb_typeof(company_research) = 'object'
  )
);

CREATE TABLE public.agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text NOT NULL DEFAULT 'info',
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT agent_logs_message_check CHECK (length(trim(message)) > 0),
  CONSTRAINT agent_logs_level_check CHECK (level IN ('info', 'success', 'warning', 'error'))
);

CREATE INDEX agent_runs_user_started_idx ON public.agent_runs(user_id, started_at DESC);
CREATE INDEX agent_runs_user_status_idx ON public.agent_runs(user_id, status);
CREATE INDEX jobs_user_found_idx ON public.jobs(user_id, found_at DESC);
CREATE INDEX jobs_user_match_score_idx ON public.jobs(user_id, match_score DESC);
CREATE INDEX jobs_user_source_idx ON public.jobs(user_id, source);
CREATE INDEX jobs_run_idx ON public.jobs(run_id);
CREATE INDEX jobs_user_researched_idx ON public.jobs(user_id, found_at DESC)
  WHERE company_research IS NOT NULL;
CREATE INDEX agent_logs_user_created_idx ON public.agent_logs(user_id, created_at DESC);
CREATE INDEX agent_logs_run_created_idx ON public.agent_logs(run_id, created_at DESC);
CREATE INDEX agent_logs_job_idx ON public.agent_logs(job_id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE OR REPLACE FUNCTION public.validate_job_run_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF NEW.run_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.agent_runs
      WHERE id = NEW.run_id
        AND user_id = NEW.user_id
    )
  THEN
    RAISE EXCEPTION 'run_id does not belong to user_id';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER jobs_validate_run_owner
  BEFORE INSERT OR UPDATE OF run_id, user_id ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_job_run_owner();

CREATE OR REPLACE FUNCTION public.validate_agent_log_owner_refs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF NEW.run_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.agent_runs
      WHERE id = NEW.run_id
        AND user_id = NEW.user_id
    )
  THEN
    RAISE EXCEPTION 'run_id does not belong to user_id';
  END IF;

  IF NEW.job_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.jobs
      WHERE id = NEW.job_id
        AND user_id = NEW.user_id
    )
  THEN
    RAISE EXCEPTION 'job_id does not belong to user_id';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER agent_logs_validate_owner_refs
  BEFORE INSERT OR UPDATE OF run_id, user_id, job_id ON public.agent_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_agent_log_owner_refs();

REVOKE ALL ON FUNCTION public.validate_job_run_owner() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.validate_agent_log_owner_refs() FROM PUBLIC;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.agent_runs FROM anon, authenticated;
REVOKE ALL ON public.jobs FROM anon, authenticated;
REVOKE ALL ON public.agent_logs FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT ON public.profiles TO authenticated;
GRANT UPDATE (
  full_name,
  email,
  phone,
  location,
  current_title,
  experience_level,
  years_experience,
  skills,
  industries,
  work_experience,
  education,
  job_titles_seeking,
  remote_preference,
  preferred_locations,
  salary_expectation,
  cover_letter_tone,
  linkedin_url,
  portfolio_url,
  work_authorization,
  resume_pdf_url,
  resume_pdf_key,
  is_complete
) ON public.profiles TO authenticated;

GRANT SELECT, INSERT ON public.agent_runs TO authenticated;
GRANT UPDATE (
  status,
  jobs_found,
  completed_at
) ON public.agent_runs TO authenticated;

GRANT SELECT, INSERT ON public.jobs TO authenticated;
GRANT UPDATE (
  company_research
) ON public.jobs TO authenticated;

GRANT SELECT, INSERT ON public.agent_logs TO authenticated;

CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can read their own agent runs"
  ON public.agent_runs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own agent runs"
  ON public.agent_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own agent runs"
  ON public.agent_runs
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can read their own jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can read their own agent logs"
  ON public.agent_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own agent logs"
  ON public.agent_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
