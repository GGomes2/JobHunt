import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero(): ReactElement {
  return (
    <section className="relative overflow-hidden bg-surface px-6 pb-16 pt-16 md:pb-24 md:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      >
        <div className="absolute left-1/2 top-[-80px] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(243,232,255,0.95)_0%,rgba(219,234,254,0.7)_40%,rgba(255,255,255,0)_70%)] blur-2xl" />
        <div className="absolute left-[35%] top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[rgba(124,92,252,0.18)] blur-3xl" />
        <div className="absolute left-[58%] top-16 h-56 w-56 rounded-full bg-[rgba(97,168,255,0.22)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        <h1 className="max-w-[720px] text-[40px] font-bold leading-[1.15] tracking-tight text-text-primary md:text-[56px] md:leading-[1.1]">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mt-5 max-w-[560px] text-base font-medium leading-6 text-text-secondary md:text-lg md:leading-7">
          Stop applying blind. JobPilot finds the jobs, researches the
          companies, and gives you everything you need to stand out.
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

      <div className="relative mx-auto mt-14 max-w-[1100px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_20px_50px_rgba(16,24,40,0.12)]">
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot dashboard showing job stats, recent activity, and company research charts"
            width={2200}
            height={1400}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
