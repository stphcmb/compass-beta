import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/Toast'
import { AuthorPanelProvider } from '@/contexts/AuthorPanelContext'
import GlobalAuthorPanel from '@/components/GlobalAuthorPanel'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compass - AI Thought Leadership Positioning Intelligence',
  description: 'Validate your AI thought leadership by searching a curated database of AI thought leaders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      // Enable client-side auth state caching for better performance
      // This reduces auth checks from 600ms to <50ms on repeat visits
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider>
            <AuthorPanelProvider>
              {children}
              <GlobalAuthorPanel />
            </AuthorPanelProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

