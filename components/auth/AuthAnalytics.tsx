"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  capturePostHogEvent,
  identifyPostHogUser,
} from "@/lib/posthog-client";

type AuthAnalyticsProps = {
  userId: string;
};

export function AuthAnalytics({ userId }: AuthAnalyticsProps): null {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authStatus = searchParams.get("auth");

  useEffect(() => {
    identifyPostHogUser(userId);
  }, [userId]);

  useEffect(() => {
    if (authStatus !== "success") {
      return;
    }

    capturePostHogEvent("oauth_sign_in_completed", { userId });

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("auth");

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [authStatus, pathname, router, searchParams, userId]);

  return null;
}
