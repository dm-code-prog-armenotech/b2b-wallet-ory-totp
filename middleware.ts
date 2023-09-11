import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  
  const session = cookies().get('ory_kratos_session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl).toString());
  }
  
  const res = await fetch('https://kratos-totp-demo.fly.dev/sessions/whoami', {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `ory_kratos_session=${session}`
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