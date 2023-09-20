import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@ory/kratos-client';

const KRATOS_URL = process.env.KRATOS_URL;
const ORY_KRATOS_SESSION = 'ory_kratos_session';
const BASIC_AAL_LEVEL = 'aal1';

const PATH_LOGIN = '/login';
const PATH_2FA_ADD = '/2fa/add';
const PATH_2FA_VERIFY = '/2fa/verify';

export async function middleware(request: NextRequest) {
  if (!KRATOS_URL) {
    return NextResponse.json(
      {
        error: 'Internal Server Error'
      },
      {
        status: 500
      }
    );
  }

  const isPathLogin = request.nextUrl.pathname === PATH_LOGIN;
  const isPath2faAdd = request.nextUrl.pathname === PATH_2FA_ADD;
  const isPath2faVerify = request.nextUrl.pathname === PATH_2FA_VERIFY;

  const redirectToLogin = new URL(PATH_LOGIN, request.nextUrl).toString();
  const redirectTo2faAdd = new URL(PATH_2FA_ADD, request.nextUrl).toString();
  const redirectTo2faVerify = new URL(
    PATH_2FA_VERIFY,
    request.nextUrl
  ).toString();

  const session = request.cookies.get(ORY_KRATOS_SESSION);
  if (!session && !isPathLogin) {
    return NextResponse.redirect(redirectToLogin);
  }

  if (!session && isPathLogin) {
    return NextResponse.next();
  }

  if (session) {
    const headers = {
      'Content-Type': 'application/json',
      Cookie: `${ORY_KRATOS_SESSION}=${session.value}`
    };

    const res = await fetch(`${KRATOS_URL}/sessions/whoami`, {
      headers
    });

    if (res.status === 401 && !isPathLogin) {
      return NextResponse.redirect(redirectToLogin);
    }

    if (res.status === 403 && !isPath2faVerify) {
      return NextResponse.redirect(redirectTo2faVerify);
    }

    const body = (await res.json()) as Session;

    const aal = body.authenticator_assurance_level;
    if (aal === BASIC_AAL_LEVEL) {
      if (!isPath2faAdd) {
        return NextResponse.redirect(redirectTo2faAdd);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/wallet', '/2fa/add', '/2fa/verify', '/login']
};
