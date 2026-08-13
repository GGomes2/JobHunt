"use client";

import posthog from "posthog-js";
import type {
  PostHogEventName,
  PostHogEventProperties,
} from "@/lib/posthog-events";

let isPostHogInitialized = false;

function getPostHogConfig(): { key: string; host: string } | null {
  const key =
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    return null;
  }

  return { key, host };
}

export function initPostHog(): void {
  if (typeof window === "undefined" || isPostHogInitialized) {
    return;
  }

  const config = getPostHogConfig();

  if (!config) {
    return;
  }

  posthog.init(config.key, {
    api_host: config.host,
    capture_pageview: false,
  });
  isPostHogInitialized = true;
}

export function capturePostHogEvent<TEvent extends PostHogEventName>(
  event: TEvent,
  properties: PostHogEventProperties<TEvent>,
): void {
  initPostHog();

  if (!isPostHogInitialized) {
    return;
  }

  posthog.capture(event, properties);
}

export function capturePostHogPageView(url: string): void {
  initPostHog();

  if (!isPostHogInitialized) {
    return;
  }

  posthog.capture("$pageview", {
    $current_url: url,
  });
}

export function identifyPostHogUser(
  userId: string,
  properties?: Record<string, string>,
): void {
  initPostHog();

  if (!isPostHogInitialized) {
    return;
  }

  posthog.identify(userId, properties);
}

export function resetPostHog(): void {
  if (!isPostHogInitialized) {
    return;
  }

  posthog.reset();
}
