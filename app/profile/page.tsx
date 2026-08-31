import type { ReactElement } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";
import { AuthAnalytics } from "@/components/auth/AuthAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { createInsforgeServer, getCurrentUser } from "@/lib/insforge-server";
import {
  parseProfileRecord,
  PROFILE_SELECT_COLUMNS,
  profileRecordToFormValues,
} from "@/lib/profile-mappers";

export const dynamic = "force-dynamic";

export default async function ProfilePage(): Promise<ReactElement> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.database
    .from("profiles")
    .select(PROFILE_SELECT_COLUMNS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[app/profile]", error);
  }

  const record = parseProfileRecord(data);
  const initialValues = profileRecordToFormValues(
    record,
    user.email,
    user.profile?.name ?? "",
  );

  return (
    <>
      <Suspense fallback={null}>
        <AuthAnalytics userId={user.id} />
      </Suspense>
      <Navbar
        user={{
          id: user.id,
          email: user.email,
          name: user.profile?.name,
        }}
        signOutAction={signOut}
      />
      <main className="flex-1 bg-background px-6 py-8">
        <div className="mx-auto flex max-w-[920px] flex-col gap-6">
          <ProfileEditor userId={user.id} initialValues={initialValues} />
        </div>
      </main>
      <Footer />
    </>
  );
}
