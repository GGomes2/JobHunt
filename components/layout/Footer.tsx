import type { ReactElement } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const footerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms & Conditions" },
] as const;

export function Footer(): ReactElement {
  return (
    <footer className="w-full border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center">
        <Logo />
        <nav className="flex flex-wrap items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
