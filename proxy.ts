import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "gd_session";
const PUBLIC_PATHS = ["/login", "/manifest.json", "/sw.js", "/icons", "/favicon.ico"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function verify(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verify(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session.role !== "DATA_ENTRY") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
