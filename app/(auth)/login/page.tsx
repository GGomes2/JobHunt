import type { ReactElement } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/layout/Logo";
import { getSafeAuthRedirectPath } from "@/lib/auth-redirects";
import { getCurrentUser } from "@/lib/insforge-server";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  oauth: "We could not complete OAuth sign in. Please try again.",
  session: "Your sign in session expired. Please start again.",
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactElement> {
  const { error, next } = await searchParams;
  const nextPath = getSafeAuthRedirectPath(next);
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="flex min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center justify-center gap-10 lg:flex-row lg:justify-between">
        <section className="max-w-[520px] text-center lg:text-left">
          <Logo />
          <h2 className="mt-8 text-[40px] font-bold leading-[1.15] tracking-tight text-text-primary md:text-[56px] md:leading-[1.1]">
            Find better roles with an AI copilot.
          </h2>
          <p className="mt-5 text-base font-medium leading-6 text-text-secondary md:text-lg md:leading-7">
            Sign in once, complete your profile, and let JobPilot score roles
            against your real skills.
          </p>
        </section>

        <LoginForm
          initialError={error ? errorMessages[error] : undefined}
          nextPath={nextPath}
        />
      </div>
    </main>
  );
}
