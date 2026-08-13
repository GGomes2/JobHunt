import type { ReactElement } from "react";
import Image from "next/image";
import { Gauge, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Understand your match score",
    description:
      "See exactly why a role fits — matched skills, gaps, and a clear reason from GPT-4o for every listing.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Job Matching",
    description:
      "Every job is scored 0–100 against your profile so you spend time on roles that actually move the needle.",
  },
  {
    icon: Target,
    title: "Focus on the right roles",
    description:
      "Filter high matches, sort by score or recency, and skip the noise that wastes evenings.",
  },
] as const;

export function Features(): ReactElement {
  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] lg:order-1">
          <Image
            src="/images/agnet-log.png"
            alt="JobPilot agent log showing job scan and matching actions"
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="max-w-[460px] text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]">
            Apply With More Confidence, Every Time
          </h2>

          <ul className="mt-10 flex flex-col gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-lightest text-info-dark">
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
      </div>
    </section>
  );
}
