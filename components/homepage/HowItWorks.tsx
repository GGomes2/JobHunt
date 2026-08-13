import type { ReactElement } from "react";
import Image from "next/image";
import { Building2, ListChecks, Search } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find jobs that actually fit",
    description:
      "Search by title and location, or paste a job link. JobPilot discovers roles matched to your real skills — not keyword spam.",
  },
  {
    icon: Building2,
    title: "Know the Company Before You Apply",
    description:
      "Get a structured dossier on culture, tech stack, and why the role exists before you ever hit apply.",
  },
  {
    icon: ListChecks,
    title: "Keep track of every application",
    description:
      "See saved, researched, and high-match jobs in one clear view so nothing slips through the cracks.",
  },
] as const;

export function HowItWorks(): ReactElement {
  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="max-w-[420px] text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]">
            Manage Your Job Search With Ease
          </h2>

          <ul className="mt-10 flex flex-col gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-5 text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <Image
            src="/images/jobs-lists.png"
            alt="Job list with match scores, salary estimates, and source badges"
            width={1200}
            height={900}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
