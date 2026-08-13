import { createAuthActions } from "@insforge/sdk/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { OAUTH_CODE_VERIFIER_COOKIE } from "@/lib/auth-constants";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const callbackUrl = request.nextUrl;
    const code = callbackUrl.searchParams.get("insforge_code");
    const providerError = callbackUrl.searchParams.get("error");

    if (providerError || !code) {
      return redirectToLogin(request, "oauth");
    }

    const codeVerifier = request.cookies.get(OAUTH_CODE_VERIFIER_COOKIE)?.value;

    if (!codeVerifier) {
      return redirectToLogin(request, "session");
    }

    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set("auth", "success");

    const response = NextResponse.redirect(dashboardUrl);
    const auth = createAuthActions({
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    const { error } = await auth.exchangeOAuthCode(code, codeVerifier);
    response.cookies.delete(OAUTH_CODE_VERIFIER_COOKIE);

    if (error) {
      console.error("[auth/callback]", error);
      return redirectToLogin(request, "oauth");
    }

    return response;
  } catch (error) {
    console.error("[auth/callback]", error);
    return redirectToLogin(request, "oauth");
  }
}

function redirectToLogin(request: NextRequest, reason: string): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", reason);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(OAUTH_CODE_VERIFIER_COOKIE);

  return response;
}
