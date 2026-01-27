import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * Create Clerk middleware with customizable public routes
 *
 * @param publicRoutes - Array of route patterns that should be public
 * @returns Configured Clerk middleware
 */
export function createMiddleware(publicRoutes: string[]) {
  const isPublicRoute = createRouteMatcher(publicRoutes)

  return clerkMiddleware(async (auth, request) => {
    // Protect all routes except public ones
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  })
}

/**
 * Default middleware config for Next.js
 */
export const middlewareConfig = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
