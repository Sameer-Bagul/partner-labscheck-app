import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from '@/configs/pagesroute';
import { BaseApiUrl } from './configs/settings';
import { yearsToDays } from 'date-fns';

// Regex to match static files
const PUBLIC_FILE = /\.(webp|png|jpg|jpeg|gif|svg|ico|txt|css|js)$/;

function addCORSHeaders(response: NextResponse, origin: string | null) {
  if (origin) {
    const isAllowedOrigin = 
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.startsWith('exp://') ||
      origin.includes('.repl.co') ||
      origin === 'https://partner.labscheck.com';

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Handle OPTIONS preflight requests for API routes
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(response, origin);
  }

  // Bypass static files, Next.js assets
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Add CORS headers to API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    return addCORSHeaders(response, origin);
  }

  // Skip middleware for public routes
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Ensure /signin is accessible
  if (pathname === '/signin') {
    return NextResponse.next();
  }

  try {
    // Check authentication
    const response = await fetch(`${BaseApiUrl}/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Auth check failed: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();

    // console.log('User data in middleware:', userData);

    // Adjust based on actual API response structure
    const user = userData.user || userData; // Handle { user: {...} } or direct { role, ... }
    // if (!user || !user.role) {
    //   throw new Error('Invalid user data');
    // }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Forward cookies if any
    const responseCookies = response.headers.get('set-cookie');
    if (responseCookies) {
      const nextResponse = NextResponse.next();
      nextResponse.headers.set('set-cookie', responseCookies);
      return nextResponse;
    }

    return NextResponse.next();   // On successfully authenticated by auth/me

  } catch (error) {
    // console.log("somethings wrong in that");

    if (error.message.includes('401')) {
      try {
        const refreshResponse = await fetch(`${BaseApiUrl}/auth/refresh`, {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!refreshResponse.ok) {
          const errorText = await refreshResponse.text().catch(() => 'No response body');
          throw new Error(`Refresh failed: ${refreshResponse.status} ${refreshResponse.statusText} - ${errorText}`);
        }

        // Forward refresh response cookies
        const refreshCookies = refreshResponse.headers.get('set-cookie');
        if (!refreshCookies) {
          console.warn('No cookies set after refresh');
        }

        // Retry auth check
        const retryResponse = await fetch(`${BaseApiUrl}/auth/me`, {
          method: 'GET',
          headers: {
            Cookie: refreshCookies || request.headers.get('cookie') || '',
          },
          credentials: 'include',
        });

        if (!retryResponse.ok) {
          throw new Error(`Retry failed: ${retryResponse.status} ${retryResponse.statusText}`);
        }

        const retryUserData = await retryResponse.json();
        // console.log('User data after refresh:', retryUserData);

        const user = retryUserData.user || retryUserData;
        if (!user) {
          throw new Error('Invalid user data after refresh');
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }


        // Forward cookies
        const retryCookies = retryResponse.headers.get('set-cookie');
        const nextResponse = NextResponse.next();
        if (refreshCookies) {
          nextResponse.headers.set('set-cookie', refreshCookies);
        }
        if (retryCookies) {
          nextResponse.headers.append('set-cookie', retryCookies);
        }
        return nextResponse;
      } catch (e) {
        const redirectUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
        console.error(`Error during refresh: ${e.message}`);
        return NextResponse.redirect(new URL(`/signin?redirectUrl=${redirectUrl}`, request.url));
      }
    }

    // Handle other errors
    console.error('Middleware error:', {
      message: error.message,
      url: request.nextUrl.href,
    });
    const redirectUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/signin?redirectUrl=${redirectUrl}`, request.url));
  }

}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)',],
};