'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { generateProfileFromAuthData } from '@/lib/auth-capture'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { UserCircle2, ArrowRight } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'

interface CaptureClientProps {
  name?: string | null
  email?: string | null
  image?: string | null
  provider?: string | null
}

function getDashboardLink(provider?: string | null): string {
  if (provider === 'github') return 'https://github.com/settings/profile'
  if (provider === 'google') return 'https://myaccount.google.com/'
  return 'https://myaccount.google.com/'
}

export default function CaptureClient({ name, email, image, provider }: CaptureClientProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const providerLabel = provider ? `${provider[0].toUpperCase()}${provider.slice(1)}` : 'Connected Account'
  const dashboardLink = getDashboardLink(provider)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const profile = generateProfileFromAuthData({ name, email, provider })
      localStorage.setItem('agentProfile', JSON.stringify(profile))
      router.push('/profile')
    } catch (error) {
      console.error('Failed to generate profile from auth data', error)
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-app text-app">
      <AppHeader
        nav={
          <>
            <Link href="/analyze" className="hidden sm:inline hover:text-accent">Upload export</Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="micro text-muted">Connected capture</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Review your connected account.</h1>
          <p className="mt-4 text-base text-muted-strong">
            Confirm the account details and generate an agent profile using connected metadata.
          </p>
        </div>

        <div className="frame p-6">
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt={name || 'User avatar'} className="h-14 w-14 border border-app object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center border border-app">
                <UserCircle2 className="h-6 w-6 text-muted-strong" />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Signed in as</p>
              <p className="text-lg font-semibold">{name || 'Connected User'}</p>
              <p className="text-sm text-muted">{email || 'No public email from provider'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="frame p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Provider</p>
              <p className="mt-2 text-sm font-semibold">{providerLabel}</p>
            </div>
            <div className="frame p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Account dashboard</p>
              <a
                href={dashboardLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                Open {providerLabel} dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="frame p-6">
          <h2 className="text-lg font-semibold">Magic Capture</h2>
          <p className="mt-3 text-sm text-muted-strong">
            We will use connected account metadata to generate a profile aligned with the questionnaire output.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating profile...' : 'Generate AI Profile'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  )
}
