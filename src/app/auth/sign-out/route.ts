/**
 * /auth/sign-out
 *
 * Clears the auth cookies and redirects to /. Linked from the worker menu
 * inside the /app shell.
 */
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/`);
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");
  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}
