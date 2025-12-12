'use client'

import { UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-10">
      <div className="h-full px-6 flex items-center justify-end">
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9',
              userButtonPopoverCard: 'shadow-lg',
            }
          }}
        />
      </div>
    </header>
  )
}
