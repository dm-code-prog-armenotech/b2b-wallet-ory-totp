import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === '/login';
  
  const session = cookies().get('ory_kratos_session');
  if (!session) {
    console.log('[middleware] session', 'session not found');
    return NextResponse.redirect(new URL('/login', request.nextUrl).toString());
  }
  
  const res = await fetch('https://kratos-totp-demo.fly.dev/sessions/whoami', {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `ory_kratos_session=${session.value}`
    }
  });
  
  if (res.status === 401 && !isLogin) {
    console.log('[middleware]', 'session invalid');
    return NextResponse.redirect(new URL('/login', request.nextUrl).toString());
  }
  
  if (isLogin && res.status === 200) {
    return NextResponse.redirect(new URL('/', request.nextUrl).toString());
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/wallet', '/2fa', '/login']
};