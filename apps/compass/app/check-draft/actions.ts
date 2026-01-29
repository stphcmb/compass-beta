'use server'

import { currentUser } from '@clerk/nextjs/server'

/**
 * Server Action to verify authentication
 * This runs on the server and is much faster than middleware
 */
export async function checkAuth() {
  const user = await currentUser()

  if (!user) {
    return { authenticated: false }
  }

  return {
    authenticated: true,
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress,
  }
}
