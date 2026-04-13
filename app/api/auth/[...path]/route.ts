import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function handler(_req: NextRequest) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as OPTIONS };
