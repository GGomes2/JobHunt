import type { ReactElement } from "react";
import { AlertCircle, CircleCheck } from "lucide-react";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";

type ProfileAttentionBannerProps = {
  completionPercentage: number;
  missingFields: readonly string[];
  isComplete: boolean;
};

export function ProfileAttentionBanner({
  completionPercentage,
  missingFields,
  isComplete,
}: ProfileAttentionBannerProps): ReactElement {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-text-primary">
            {isComplete ? (
              <CircleCheck className="size-4 text-success" aria-hidden />
            ) : (
              <AlertCircle className="size-4 text-error" aria-hidden />
            )}
            <h1 className="text-base font-semibold leading-6">
              {isComplete ? "Profile complete" : "Profile needs attention"}
            </h1>
          </div>
          <p className="mt-2 max-w-[520px] text-sm font-medium leading-5 text-text-secondary">
            {isComplete
              ? "Your profile has the required details for job matching and resume generation."
              : "Complete the missing fields to improve your chances of getting matched with jobs and generating stronger resumes."}
          </p>
          {missingFields.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {missingFields.map((field) => (
                <span
                  key={field}
                  className="rounded-full bg-accent-muted px-2 py-0.5 text-xs font-medium uppercase leading-4 text-error"
                >
                  {field}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <CompletionIndicator
          percentage={completionPercentage}
          isComplete={isComplete}
        />
      </div>
    </section>
  );
}
