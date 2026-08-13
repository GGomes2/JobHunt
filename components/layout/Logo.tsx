import type { ReactElement } from "react";
import Link from "next/link";

type LogoProps = {
  href?: string;
};

export function Logo({ href = "/" }: LogoProps): ReactElement {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-[10px] bg-[linear-gradient(45deg,#7C5CFC_0%,#4A2EC5_100%)]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="6.5" height="6.5" rx="1.5" fill="white" />
          <rect x="9.5" y="0" width="6.5" height="6.5" rx="1.5" fill="white" />
          <rect x="0" y="9.5" width="6.5" height="6.5" rx="1.5" fill="white" />
          <rect
            x="9.5"
            y="9.5"
            width="6.5"
            height="6.5"
            rx="1.5"
            fill="white"
          />
        </svg>
      </span>
      <span className="text-[19px] font-bold leading-7 text-text-darkest">
        JobPilot
      </span>
    </Link>
  );
}
