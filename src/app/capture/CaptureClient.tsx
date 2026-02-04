'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { generateProfileFromAuthData } from '@/lib/auth-capture'

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
    <main className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold brand-logo">
            agent-me.app
          </Link>
          <Link href="/analyze" className="text-gray-400 hover:text-white transition-colors">
            Upload export instead →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Connected Data Capture
            </span>
          </h1>
          <p className="text-gray-400">
            You are signed in. Review your account details, then generate your AI profile in one click.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt={name || 'User avatar'} className="w-16 h-16 rounded-full border border-gray-700" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-xl font-semibold text-white">{name || 'Connected User'}</p>
              <p className="text-gray-400">{email || 'No public email from provider'}</p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Provider</p>
              <p className="text-white font-medium">{providerLabel}</p>
            </div>
            <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Account dashboard</p>
              <a
                href={dashboardLink}
                target="_blank"
                rel="noreferrer"
                className="text-primary-300 hover:text-primary-200 underline"
              >
                Open {providerLabel} dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-primary-500/30 bg-primary-500/5">
          <h2 className="text-xl font-semibold text-white mb-2">Magic Capture</h2>
          <p className="text-gray-400 mb-5">
            We will use your connected account metadata to generate a profile in the same format as questionnaire output.
          </p>
          <div className="relative inline-block w-full sm:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-xl blur-lg opacity-60 transition-opacity" />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-fuchsia-600 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? 'Generating profile...' : 'Generate AI Profile from Connected Data'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
