import type { ReactElement } from "react";
import Image from "next/image";

export function Testimonial(): ReactElement {
  return (
    <section className="relative overflow-hidden bg-surface-muted px-6 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(231,234,243,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,234,243,0.45)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto flex max-w-[820px] flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-info-muted">
          Success Stories
        </p>
        <blockquote className="mt-6 text-[28px] font-semibold leading-9 tracking-tight text-text-primary md:text-[36px] md:leading-[1.25]">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open
          my dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.&rdquo;
        </blockquote>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Image
            src="/images/user-icon.png"
            alt="Tom Wilson"
            width={56}
            height={56}
            className="size-14 rounded-full border border-border object-cover"
          />
          <div>
            <p className="text-sm font-semibold leading-5 text-text-primary">
              Tom Wilson
            </p>
            <p className="text-xs font-normal leading-4 text-text-muted">
              Junior Web Dev
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
