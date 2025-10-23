import { NextResponse } from "next/server";

// This route was removed — return 404 to ensure the page at /top-purchased
// is rendered instead of serving JSON.
export async function GET() {
  return NextResponse.json({ error: "removed" }, { status: 404 });
}
