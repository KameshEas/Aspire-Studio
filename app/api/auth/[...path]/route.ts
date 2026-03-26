import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// With Clerk handling authentication, this proxy route is no longer needed
// for auth flows. Keeping a minimal handler that returns 404 for any
// leftover /api/auth/* requests that aren't handled by Clerk.

function handler(_req: NextRequest) {
  return NextResponse.json(
    { error: "Auth is handled by Clerk. This endpoint is deprecated." },
    { status: 404 }
  );
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as OPTIONS };
