import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  let isAuthenticated = Boolean(accessToken);
  let refreshedCookieStrings: string[] = [];

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      isAuthenticated =
        sessionResponse.status === 200 && sessionResponse.data.success;

      if (isAuthenticated) {
        const setCookie = sessionResponse.headers['set-cookie'];
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            if (parsed.value) {
              refreshedCookieStrings.push(cookieStr);
            }
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    for (const cookieStr of refreshedCookieStrings) {
      const parsed = parseSetCookie(cookieStr);
      if (parsed.value) {
        response.cookies.set(parsed.name, parsed.value, parsed);
      }
    }
    return response;
  }

  if (isAuthenticated && isPublicRoute) {
    const response = NextResponse.redirect(new URL('/', request.url));
    for (const cookieStr of refreshedCookieStrings) {
      const parsed = parseSetCookie(cookieStr);
      if (parsed.value) {
        response.cookies.set(parsed.name, parsed.value, parsed);
      }
    }
    return response;
  }

  const response = NextResponse.next();
  for (const cookieStr of refreshedCookieStrings) {
    const parsed = parseSetCookie(cookieStr);
    if (parsed.value) {
      response.cookies.set(parsed.name, parsed.value, parsed);
    }
  }
  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
