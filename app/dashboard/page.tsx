import type { ReactElement } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";
import { AuthAnalytics } from "@/components/auth/AuthAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getCurrentUser } from "@/lib/insforge-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage(): Promise<ReactElement> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Suspense fallback={null}>
        <AuthAnalytics userId={user.id} />
      </Suspense>
      <Navbar
        user={{
          id: user.id,
          email: user.email,
          name: user.profile?.name,
        }}
        signOutAction={signOut}
      />
      <main className="flex-1 bg-background px-6 py-8">
        <section className="mx-auto max-w-[1440px] rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-info-muted">
            Auth connected
          </p>
          <h1 className="mt-3 text-[32px] font-bold leading-10 tracking-tight text-text-primary">
            Welcome to your dashboard
          </h1>
          <p className="mt-3 max-w-[620px] text-sm font-medium leading-5 text-text-secondary">
            You are signed in as {user.email}. The full dashboard UI is the next
            planned feature after auth, PostHog, and database setup.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
