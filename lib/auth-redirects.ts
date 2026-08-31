export const DEFAULT_AUTH_REDIRECT_PATH = "/dashboard";

export function getSafeAuthRedirectPath(
  value: string | null | undefined,
): string {
  const path = value?.trim();

  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  if (path.startsWith("/login") || path.startsWith("/callback")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return path;
}
