import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@compass/ui'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Studio - Content Creation Platform',
  description: 'Create voice-constrained content from briefs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased bg-[#0a0f1a] text-white min-h-screen`}>
          <ToastProvider>
            <Header />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
