import type { InsForgeClient } from "@insforge/sdk";
import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

type CurrentUser = NonNullable<
  Awaited<ReturnType<InsForgeClient["auth"]["getCurrentUser"]>>["data"]
>["user"];

export async function createInsforgeServer(): Promise<InsForgeClient> {
  const cookieStore = await cookies();

  return createServerClient({
    cookies: cookieStore,
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge.auth.getCurrentUser();

    if (error) {
      console.error("[lib/insforge-server]", error);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("[lib/insforge-server]", error);
    return null;
  }
}
