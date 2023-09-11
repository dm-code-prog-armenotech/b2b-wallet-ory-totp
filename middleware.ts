import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = await fetch('https://kratos-totp-demo.fly.dev/sessions/whoami', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 401) {
    return NextResponse.redirect(new URL('/login', request.nextUrl).toString());
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/wallet', '/2fa']
};