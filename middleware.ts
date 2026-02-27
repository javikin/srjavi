import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Public routes that do NOT require authentication.
 * These are the existing public site routes + API routes that must remain open.
 */
const PUBLIC_ROUTES = [
  '/',
  '/ship',
  '/journal',
  '/about',
  '/login',
  '/forgot-password',
  '/reset-password',
];

const PUBLIC_PREFIXES = [
  '/journal/',
  '/projects/',
  '/api/tina/',
  '/api/github/webhook',
  '/api/cron/',
  '/auth/callback',
  '/_next/',
  '/favicon',
  '/images/',
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes entirely
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Only protect /admin/* and /portal/* routes
  const isProtectedRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/portal');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Create a response to pass through cookie operations
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session (important for keeping sessions alive)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no authenticated user, redirect to login
  if (error || !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.app_metadata?.role;

  // Protect /admin routes: require admin role
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      // Client trying to access admin -> redirect to portal
      // Fetch first project slug for this user
      const redirectUrl = new URL('/portal', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect /portal routes: require client or admin role
  if (pathname.startsWith('/portal')) {
    // Admins can access portal too (for previewing client view)
    // Clients need to be authenticated (already checked above)
    // Project-level access check is done in the portal layout server component
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
