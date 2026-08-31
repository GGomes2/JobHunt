"use client";

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
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
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
        <Logo />

        <nav className="order-3 flex w-full items-center justify-center gap-6 border-t border-border pt-3 md:absolute md:left-1/2 md:order-none md:w-auto md:-translate-x-1/2 md:border-0 md:pt-0">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-xs font-medium leading-4 transition-colors hover:text-accent md:text-sm md:leading-5 ${
                  isActive ? "text-accent" : "text-text-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-6 top-4 md:static">
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
      </div>
    </header>
  );
}
