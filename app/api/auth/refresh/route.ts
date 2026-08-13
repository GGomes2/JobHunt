import { createRefreshAuthRouter } from "@insforge/sdk/ssr";

const refreshAuthRouter = createRefreshAuthRouter();

export async function POST(request: Request): Promise<Response> {
  try {
    return await refreshAuthRouter.POST(request);
  } catch (error) {
    console.error("[api/auth/refresh]", error);

    return Response.json(
      { success: false, error: "Unable to refresh session" },
      { status: 500 },
    );
  }
}
