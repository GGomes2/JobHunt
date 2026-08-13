"use client";

import type { ReactElement, ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  capturePostHogPageView,
  initPostHog,
} from "@/lib/posthog-client";

type PostHogProviderProps = {
  children: ReactNode;
};

export function PostHogProvider({
  children,
}: PostHogProviderProps): ReactElement {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PostHogPageViews />
      </Suspense>
    </>
  );
}

function PostHogPageViews(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authStatus = searchParams.get("auth");
  const search = searchParams.toString();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (authStatus === "success") {
      return;
    }

    const query = search ? `?${search}` : "";
    capturePostHogPageView(`${window.location.origin}${pathname}${query}`);
  }, [authStatus, pathname, search]);

  return null;
}
