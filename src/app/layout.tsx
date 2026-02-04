import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'agent.me - Create Your AI Twin',
  description: 'Generate a personalized AI agent based on your personality, work style, and communication patterns.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gray-950 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
