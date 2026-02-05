import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Analytics } from '@/components/analytics/Analytics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agent-me.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'agent-me.app - Create Your AI Twin',
    template: '%s | agent-me.app',
  },
  description: 'Create a personalized AI assistant that mirrors your communication style, work preferences, and expertise.',
  keywords: [
    'AI personal assistant',
    'AI agent builder',
    'digital twin assistant',
    'personalized AI assistant',
    'AI prompt profile generator',
    'AI assistant for developers',
    'AI assistant for founders',
    'AI assistant for managers',
    'AI assistant for creators',
    'AI assistant for knowledge workers',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'agent-me.app - Create Your AI Twin',
    description: 'Build an AI assistant that sounds like you and works the way you do.',
    url: '/',
    siteName: 'agent-me.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'agent-me.app - Create Your AI Twin',
    description: 'Build an AI assistant that sounds like you and works the way you do.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-app text-app min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-app focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
