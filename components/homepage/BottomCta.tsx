import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BottomCta(): ReactElement {
  return (
    <section className="relative overflow-hidden bg-surface px-6 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[360px] -translate-y-1/2"
      >
        <div className="absolute left-1/2 top-0 h-full w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(243,232,255,0.9)_0%,rgba(219,234,254,0.65)_45%,rgba(255,255,255,0)_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mt-4 max-w-[480px] text-base font-medium leading-6 text-text-secondary">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
        </p>

        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-text-black px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Get Started
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
