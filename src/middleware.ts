import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const absoluteUrl = new URL(request.url);
  const relativeUrl =
    absoluteUrl.pathname + absoluteUrl.search + absoluteUrl.hash;
  requestHeaders.set("x-initial-url", relativeUrl);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
