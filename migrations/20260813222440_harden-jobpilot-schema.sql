ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_resume_pdf_key_owner_path_check CHECK (
    resume_pdf_key IS NULL OR resume_pdf_key = (id::text || '/resume.pdf')
  );

CREATE OR REPLACE FUNCTION public.set_profile_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  NEW.is_complete :=
    nullif(btrim(coalesce(NEW.full_name, '')), '') IS NOT NULL
    AND nullif(btrim(coalesce(NEW.email, '')), '') IS NOT NULL
    AND nullif(btrim(coalesce(NEW.phone, '')), '') IS NOT NULL
    AND nullif(btrim(coalesce(NEW.location, '')), '') IS NOT NULL
    AND nullif(btrim(coalesce(NEW.current_title, '')), '') IS NOT NULL
    AND NEW.experience_level IS NOT NULL
    AND NEW.years_experience IS NOT NULL
    AND cardinality(NEW.skills) > 0
    AND jsonb_typeof(NEW.work_experience) = 'array'
    AND jsonb_array_length(NEW.work_experience) > 0
    AND jsonb_typeof(NEW.education) = 'object'
    AND NEW.education <> '{}'::jsonb
    AND cardinality(NEW.job_titles_seeking) > 0
    AND NEW.remote_preference IS NOT NULL
    AND NEW.work_authorization IS NOT NULL;

  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_completion
  BEFORE INSERT OR UPDATE OF
    full_name,
    email,
    phone,
    location,
    current_title,
    experience_level,
    years_experience,
    skills,
    work_experience,
    education,
    job_titles_seeking,
    remote_preference,
    work_authorization
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_profile_completion();

REVOKE ALL ON FUNCTION public.set_profile_completion() FROM PUBLIC;

REVOKE INSERT ON public.profiles FROM authenticated;
GRANT INSERT (
  id,
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
  resume_pdf_key
) ON public.profiles TO authenticated;

REVOKE UPDATE (
  email,
  is_complete
) ON public.profiles FROM authenticated;

REVOKE INSERT ON public.agent_runs FROM authenticated;
GRANT INSERT (
  user_id,
  job_title_searched,
  location_searched
) ON public.agent_runs TO authenticated;

REVOKE INSERT ON public.jobs FROM authenticated;
GRANT INSERT (
  run_id,
  user_id,
  source,
  source_url,
  external_apply_url,
  title,
  company,
  location,
  salary,
  job_type,
  about_role,
  responsibilities,
  requirements,
  nice_to_have,
  benefits,
  about_company,
  match_score,
  match_reason,
  matched_skills,
  missing_skills
) ON public.jobs TO authenticated;

REVOKE INSERT ON public.agent_logs FROM authenticated;
GRANT INSERT (
  run_id,
  user_id,
  message,
  level,
  job_id
) ON public.agent_logs TO authenticated;
