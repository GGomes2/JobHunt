import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "JobPilot — AI Job Hunting Assistant",
  description:
    "Stop applying blind. JobPilot finds the jobs, researches the companies, and gives you everything you need to stand out.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">): ReactElement {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
