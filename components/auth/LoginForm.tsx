"use client";

import type { ReactElement } from "react";
import { useActionState } from "react";
import { signInWithGitHub, signInWithGoogle } from "@/actions/auth";
import type { OAuthActionState } from "@/lib/auth-constants";
import type { OAuthProvider } from "@/lib/posthog-events";
import { capturePostHogEvent } from "@/lib/posthog-client";
import { LoaderCircle } from "lucide-react";

type LoginFormProps = {
  initialError?: string;
  nextPath: string;
};

const initialState: OAuthActionState = {};

export function LoginForm({
  initialError,
  nextPath,
}: LoginFormProps): ReactElement {
  const [googleState, googleAction, isGooglePending] = useActionState(
    signInWithGoogle,
    initialState,
  );
  const [githubState, githubAction, isGitHubPending] = useActionState(
    signInWithGitHub,
    initialState,
  );

  const error = initialError ?? googleState.error ?? githubState.error;
  const isPending = isGooglePending || isGitHubPending;

  const handleSignInStart = (provider: OAuthProvider): void => {
    capturePostHogEvent("oauth_sign_in_started", { provider });
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-info-muted">
          Welcome to JobPilot
        </p>
        <h1 className="mt-3 text-[32px] font-bold leading-10 tracking-tight text-text-primary">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm font-medium leading-5 text-text-secondary">
          Use your Google or GitHub account to set up your profile and start
          finding strong job matches.
        </p>
      </div>

      {error ? (
        <p className="mt-5 rounded-md border border-border bg-accent-muted px-3 py-2 text-sm font-medium leading-5 text-accent">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        <form
          action={googleAction}
          onSubmit={() => handleSignInStart("google")}
        >
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGooglePending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <span aria-hidden className="text-sm font-semibold">
                G
              </span>
            )}
            Continue with Google
          </button>
        </form>

        <form
          action={githubAction}
          onSubmit={() => handleSignInStart("github")}
        >
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-text-black px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGitHubPending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <span aria-hidden className="text-sm font-semibold">
                GH
              </span>
            )}
            Continue with GitHub
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs font-normal leading-4 text-text-muted">
        By continuing, you agree to use JobPilot for your own job search
        workspace.
      </p>
    </div>
  );
}
