import type { CSSProperties, ReactElement } from "react";

type CompletionIndicatorProps = {
  percentage: number;
  isComplete: boolean;
};

type RingStyle = CSSProperties & {
  "--completion": string;
};

export function CompletionIndicator({
  percentage,
  isComplete,
}: CompletionIndicatorProps): ReactElement {
  const ringStyle: RingStyle = {
    "--completion": `${percentage}%`,
  };

  return (
    <div
      aria-label={`Profile ${percentage}% complete`}
      style={ringStyle}
      className={`flex size-24 items-center justify-center rounded-full p-2 ${
        isComplete
          ? "bg-[conic-gradient(var(--color-success)_var(--completion),var(--color-success-light)_0)]"
          : "bg-[conic-gradient(var(--color-error)_var(--completion),var(--color-accent-light)_0)]"
      }`}
    >
      <div className="flex size-full items-center justify-center rounded-full bg-surface">
        <span className="text-2xl font-semibold leading-8 text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
