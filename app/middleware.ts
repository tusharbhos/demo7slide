import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // slide pages detect
  if (pathname.startsWith('/slide-')) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // redirect to home
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/slide-:path*'],
};
