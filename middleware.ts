import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === '/login';
  
  const session = request.cookies.get('ory_kratos_session');
  if (!session && !isLogin) {
    return NextResponse.redirect(new URL('/login', request.nextUrl).toString());
  }
  
  if (!session && isLogin) {
    return NextResponse.next();
  }
  
  if (session) {
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
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/wallet', '/2fa', '/login']
};