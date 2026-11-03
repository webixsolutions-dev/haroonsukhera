import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Enforce trailing slash via 301 on page routes (excluding static assets, api, and files with extensions)
  const isSpecialOrFile =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.[a-z0-9]+$/i.test(pathname);

  if (pathname !== "/" && !pathname.endsWith("/") && !isSpecialOrFile) {
    const dest = new URL(`${pathname}/`, req.url);
    dest.search = req.nextUrl.search;
    return NextResponse.redirect(dest, 301);
  }

  // 2. Attach X-Robots-Tag: noindex on non-production hosts
  const res = NextResponse.next();
  const host = req.headers.get("host") ?? "";
  const isProdHost = host === "haroonsukhera.com" || host === "www.haroonsukhera.com";

  if (!isProdHost) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
