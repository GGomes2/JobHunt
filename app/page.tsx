import type { ReactElement } from "react";
import { redirect } from "next/navigation";
import { BottomCta } from "@/components/homepage/BottomCta";
import { Features } from "@/components/homepage/Features";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonial } from "@/components/homepage/Testimonial";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getCurrentUser } from "@/lib/insforge-server";

export const dynamic = "force-dynamic";

export default async function HomePage(): Promise<ReactElement> {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonial />
        <BottomCta />
      </main>
      <Footer />
    </>
  );
}
