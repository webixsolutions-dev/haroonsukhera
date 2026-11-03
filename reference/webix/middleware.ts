import { NextResponse, type NextRequest } from "next/server";
import {
  EXACT_301_REDIRECTS,
  EXACT_410_PATHS,
  PREFIX_301_TO_BLOGS,
  PREFIX_410_PATHS,
} from "./config/redirects";

const GONE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>410 Gone | Webix Solutions</title>
  <meta name="robots" content="noindex" />
</head>
<body style="font-family:system-ui,sans-serif;background:#141519;color:#F5F6F8;padding:48px;">
  <h1>410 Gone</h1>
  <p>This resource has been permanently removed.</p>
  <p><a href="/" style="color:#ED1C24;">Return to Webix Solutions</a></p>
</body>
</html>`;

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // 1. WordPress ?p=* query parameter -> 410 Gone
  if (searchParams.has("p")) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }

  // 2. Exact or prefix 410 Gone (/market/*, WP endpoints, /ai-contextual-governance-solution/)
  if (
    EXACT_410_PATHS.has(lowerPath) ||
    lowerPath === "/market" ||
    PREFIX_410_PATHS.some((prefix) => lowerPath.startsWith(prefix))
  ) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }

  // 3. Exact 301 Redirects (including /category/restaurant/ -> /industries/)
  const exactTarget = EXACT_301_REDIRECTS[lowerPath];
  if (exactTarget) {
    const dest = new URL(exactTarget, req.url);
    return NextResponse.redirect(dest, 301);
  }

  // 4. Prefix 301 Redirects (/category/*, /tag/*, /author/*, /feed* -> /blogs/)
  if (PREFIX_301_TO_BLOGS.some((prefix) => lowerPath.startsWith(prefix))) {
    const dest = new URL("/blogs/", req.url);
    return NextResponse.redirect(dest, 301);
  }

  // 5. Enforce trailing slash via 301 on page routes (excluding files & opengraph-image)
  const isFileOrSpecial =
    pathname === "/opengraph-image" ||
    pathname.startsWith("/api/") ||
    /\.[a-z0-9]+$/i.test(pathname);
  if (pathname !== "/" && !pathname.endsWith("/") && !isFileOrSpecial) {
    const dest = new URL(`${pathname}/`, req.url);
    return NextResponse.redirect(dest, 301);
  }

  // 6. Continue request & attach X-Robots-Tag: noindex, nofollow on non-production hosts
  const res = NextResponse.next();
  const host = req.headers.get("host") ?? "";
  const isProdHost =
    host === "webixsolutions.com" || host === "www.webixsolutions.com";

  if (!isProdHost) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
