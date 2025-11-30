import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If the user is not authenticated, protect routes
  if (!userId) {
    if (pathname.startsWith('/api')) {
      // For API routes, return a 401 Unauthorized response
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // For page routes, redirect to the sign-in page
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated and tries to access a sign-in/sign-up page, redirect to dashboard
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow authenticated users to access all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
