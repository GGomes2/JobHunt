"use client";

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import {
  capturePostHogEvent,
  identifyPostHogUser,
  resetPostHog,
} from "@/lib/posthog-client";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
] as const;

type NavbarProps = {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  signOutAction?: () => Promise<void>;
};

export function Navbar({ user, signOutAction }: NavbarProps): ReactElement {
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || identifiedUserId.current === user.id) {
      return;
    }

    identifyPostHogUser(user.id, {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
    });
    identifiedUserId.current = user.id;
  }, [user]);

  const handleSignOut = () => {
    if (user) {
      capturePostHogEvent("sign_out_clicked", { userId: user.id });
    }

    resetPostHog();
    identifiedUserId.current = null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {signOutAction ? (
          <form action={signOutAction} onSubmit={handleSignOut}>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-text-black px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-text-black px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start for Free
          </Link>
        )}
      </div>
    </header>
  );
}
