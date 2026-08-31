"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  OAUTH_CODE_VERIFIER_COOKIE,
  OAUTH_CODE_VERIFIER_MAX_AGE_SECONDS,
  OAUTH_NEXT_PATH_COOKIE,
  type OAuthActionState,
} from "@/lib/auth-constants";
import { getSafeAuthRedirectPath } from "@/lib/auth-redirects";

type AuthProvider = "google" | "github";

export async function signInWithGoogle(
  _prevState: OAuthActionState,
  formData: FormData,
): Promise<OAuthActionState> {
  void _prevState;

  return startOAuth("google", getNextPath(formData));
}

export async function signInWithGitHub(
  _prevState: OAuthActionState,
  formData: FormData,
): Promise<OAuthActionState> {
  void _prevState;

  return startOAuth("github", getNextPath(formData));
}

export async function signOut(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({
      cookies: cookieStore,
    });

    const { error } = await auth.signOut();

    if (error) {
      console.error("[actions/auth]", error);
    }
  } catch (error) {
    console.error("[actions/auth]", error);
  }

  redirect("/login");
}

async function startOAuth(
  provider: AuthProvider,
  nextPath: string,
): Promise<OAuthActionState> {
  let redirectUrl: string | null = null;

  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({
      cookies: cookieStore,
    });

    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: `${await getRequestOrigin()}/callback`,
      skipBrowserRedirect: true,
      additionalParams:
        provider === "google" ? { prompt: "select_account" } : undefined,
    });

    if (error || !data.url || !data.codeVerifier) {
      console.error("[actions/auth]", error);
      return {
        error: "Could not start sign in. Please try again.",
      };
    }

    cookieStore.set(OAUTH_CODE_VERIFIER_COOKIE, data.codeVerifier, {
      httpOnly: true,
      maxAge: OAUTH_CODE_VERIFIER_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set(OAUTH_NEXT_PATH_COOKIE, nextPath, {
      httpOnly: true,
      maxAge: OAUTH_CODE_VERIFIER_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    redirectUrl = data.url;
  } catch (error) {
    console.error("[actions/auth]", error);
    return {
      error: "Could not start sign in. Please try again.",
    };
  }

  if (!redirectUrl) {
    return {
      error: "Could not start sign in. Please try again.",
    };
  }

  redirect(redirectUrl);
}

function getNextPath(formData: FormData): string {
  const nextValue = formData.get("next");

  return getSafeAuthRedirectPath(
    typeof nextValue === "string" ? nextValue : null,
  );
}

async function getRequestOrigin(): Promise<string> {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}
