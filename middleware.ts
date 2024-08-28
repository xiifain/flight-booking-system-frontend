import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token");

  if (request.nextUrl.pathname.startsWith("/login") && token) {
    console.log("login and token exists");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!request.nextUrl.pathname.startsWith("/login") && !token) {
    console.log("not login and token does not exists");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
