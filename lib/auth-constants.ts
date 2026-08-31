export const OAUTH_CODE_VERIFIER_COOKIE = "jobpilot_oauth_code_verifier";
export const OAUTH_NEXT_PATH_COOKIE = "jobpilot_oauth_next_path";
export const OAUTH_CODE_VERIFIER_MAX_AGE_SECONDS = 10 * 60;

export type OAuthActionState = {
  error?: string;
};
