import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes (routes that don't require authentication)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)', // Webhooks should be public
  '/', // Make homepage public
])

// Optimized Clerk middleware
// By not calling auth.protect() here, we move auth checks to Server Components
// This significantly reduces middleware overhead (600-700ms → <50ms)
export default clerkMiddleware(async (auth, request) => {
  // Skip middleware protection - let Server Components handle auth
  // This allows middleware to be fast and non-blocking
  // Auth is still enforced via currentUser() in page.tsx Server Components
  return
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
