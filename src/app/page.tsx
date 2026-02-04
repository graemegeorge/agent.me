'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Script from 'next/script'
import { ArrowRight, Link2, MessagesSquare, Sparkles, ClipboardList } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: MessagesSquare,
      title: 'ChatGPT History Analysis',
      description: 'Upload your ChatGPT export and we\'ll analyze your conversation patterns, interests, and communication style.',
    },
    {
      icon: ClipboardList,
      title: 'Smart Questionnaire',
      description: 'Answer thoughtful questions about your work style, preferences, and goals to build your agent profile.',
    },
    {
      icon: Link2,
      title: 'Connect Your Accounts',
      description: 'Link Google or GitHub to enrich your profile with additional context about how you work.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Our AI synthesizes all your data into a personalized agent that thinks and communicates like you.',
    },
  ]

  return (
    <main className="min-h-screen bg-app text-app">
      <Script
        id="software-application-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'agent-me.app',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Create a personalized AI assistant based on your communication style, work habits, and goals.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'Developers, founders, managers, creators, and knowledge workers',
            },
          }),
        }}
      />

      <div className="fixed right-3 top-3 z-50 md:right-4 md:top-4">
        <ThemeToggle />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="hero-overlay absolute inset-0" />

        <div className="absolute left-4 top-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl md:left-10 md:top-20 md:h-72 md:w-72" />
        <div className="absolute right-4 top-24 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl md:right-20 md:top-40 md:h-96 md:w-96" style={{ animationDelay: '-2s' }} />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-20 md:pb-28 lg:px-8">
          <div className="panel-surface mx-auto max-w-5xl rounded-2xl px-4 py-6 text-center shadow-[0_16px_38px_rgba(59,130,246,0.13)] sm:px-6 md:rounded-3xl md:px-8 md:py-10">
            <div className="mb-6 inline-flex items-center justify-center md:mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500 to-fuchsia-500 opacity-40 blur-lg" />
                <div className="relative rounded-2xl border border-gray-800 bg-gray-900 px-5 py-2.5 md:px-6 md:py-3">
                  <span className="text-gradient-brand text-2xl font-bold md:text-4xl">agent-me.app</span>
                </div>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl md:mb-6 md:text-7xl">
              <span className="text-gradient-heading">Create Your</span>
              <br />
              <span className="text-gradient-accent">AI Twin</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-strong md:mb-10 md:text-2xl">
              Build a personalized AI agent that understands your work style,
              communication patterns, and expertise. Your digital counterpart, ready to assist.
            </p>

            <div className="mb-6 flex flex-col justify-center gap-3 sm:mb-8 sm:flex-row sm:gap-4">
              <Tooltip content="The most in depth analysis of your conversational personality.">
                <Link
                  href="/analyze"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-sky-600 hover:to-fuchsia-600 sm:w-auto md:px-8 md:py-4 md:text-lg"
                >
                  Upload ChatGPT Export
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                </Link>
              </Tooltip>

              <Tooltip content="Shape the agent in a way you prefer.">
                <Link
                  href="/questionnaire"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-gray-700 sm:w-auto md:px-8 md:py-4 md:text-lg"
                >
                  Take the Questionnaire
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                </Link>
              </Tooltip>
            </div>

            <div className="flex flex-col items-center gap-3 md:gap-4">
              <p className="text-sm text-muted">Or connect your accounts to get started</p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                <Tooltip content="Use your calendar, docs and email style to shape the agent.">
                  <button
                    onClick={() => signIn('google', { callbackUrl: '/capture' })}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100 sm:w-auto md:px-6 md:text-base"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                </Tooltip>

                <Tooltip content="Use your code review style, comments and coding interests to shape the agent.">
                  <button
                    onClick={() => signIn('github', { callbackUrl: '/capture' })}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-gray-700 sm:w-auto md:px-6 md:text-base"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Sign in with GitHub
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gray-950 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="mb-3 text-2xl font-bold text-white md:mb-4 md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-base text-muted md:text-lg">Multiple ways to build your personalized AI agent</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="relative group"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 blur-xl transition-opacity duration-300 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="glass relative h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 md:p-6">
                    <Icon className="mb-4 h-7 w-7 text-primary-300 md:h-8 md:w-8" />
                    <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">{feature.title}</h3>
                    <p className="text-sm text-muted-strong md:text-base">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-gray-950 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="mb-3 text-2xl font-bold text-white md:mb-4 md:text-4xl">What&apos;s it for?</h2>
            <p className="mx-auto max-w-3xl text-base text-muted md:text-lg">
              Turn your exported profile files and system prompts into practical help for real work,
              whether you write code every day or never touch it.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="glass rounded-2xl border border-gray-800 p-5 md:p-6">
              <h3 className="mb-3 text-lg font-semibold text-white md:text-xl">For non-technical work</h3>
              <ul className="space-y-2.5 text-sm text-muted-strong md:space-y-3 md:text-base">
                <li>Write emails, proposals, and docs in your voice even when you&apos;re busy.</li>
                <li>Prep for meetings faster with summaries and talking points that sound like you.</li>
                <li>Delegate repetitive writing and admin tasks without losing quality or tone.</li>
                <li>Onboard new teammates with clear &quot;how I work&quot; guidance from your profile.</li>
              </ul>
            </div>

            <div className="glass rounded-2xl border border-gray-800 p-5 md:p-6">
              <h3 className="mb-3 text-lg font-semibold text-white md:text-xl">For technical work</h3>
              <ul className="space-y-2.5 text-sm text-muted-strong md:space-y-3 md:text-base">
                <li>Generate PR descriptions, issue breakdowns, and implementation plans faster.</li>
                <li>Reuse your system prompt in IDE assistants for more consistent code support.</li>
                <li>Draft architecture notes and tradeoff analysis in your normal decision style.</li>
                <li>Create support agents for docs and triage with your preferred level of detail.</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 md:mt-6 md:p-6">
            <h3 className="mb-3 text-lg font-semibold text-white md:text-xl">Why the exportables matter</h3>
            <p className="text-sm text-muted-strong md:text-base">
              The downloadable files (like <code>AGENT.md</code>, <code>SKILLS.md</code>, and <code>SYSTEM_PROMPT.md</code>)
              give you portable building blocks you can plug into ChatGPT, Claude, custom GPTs, internal tools,
              or team workflows so your assistant stays consistent wherever you use it.
            </p>
          </div>
        </div>
      </section>

      <section className="section-muted relative py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-gradient-brand mb-5 text-2xl font-bold md:text-4xl">Export Your ChatGPT History</h2>
              <p className="mb-6 text-base text-muted-strong md:mb-8 md:text-lg">
                Your ChatGPT conversations contain a goldmine of information about how you think,
                communicate, and solve problems. Here&apos;s how to export them:
              </p>

              <div className="space-y-3 md:space-y-4">
                {[
                  'Open ChatGPT and go to Settings',
                  'Navigate to Data Controls',
                  'Click "Export Data"',
                  'Download the ZIP file',
                  'Upload the conversations.json file here',
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-xs font-semibold text-white md:h-8 md:w-8 md:text-sm">
                      {index + 1}
                    </div>
                    <p className="pt-0.5 text-sm text-muted-strong md:pt-1 md:text-base">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 md:mt-8">
                <p className="text-sm text-muted-strong">
                  <span className="font-semibold text-sky-400">Privacy First:</span> Your data is processed locally and never stored on our servers.
                  We only extract patterns and insights, not your actual conversations.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 blur-2xl" />
              <div className="glass relative rounded-3xl p-5 md:p-8">
                <div className="rounded-2xl bg-gray-900 p-4 md:p-6">
                  <div className="mb-4 flex items-center gap-3 border-b border-gray-800 pb-3 md:pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500 md:text-sm">conversations.json</span>
                  </div>
                  <pre className="overflow-hidden text-xs text-muted-strong md:text-sm">
{`{
  "conversations": [
    {
      "title": "React Performance...",
      "messages": [
        {
          "role": "user",
          "content": "How do I..."
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-5xl">Ready to Meet Your AI Twin?</h2>
          <p className="mb-8 text-base text-muted-strong md:mb-10 md:text-xl">
            Start building your personalized agent today. It only takes a few minutes.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-sky-600 hover:to-fuchsia-600 hover:shadow-xl hover:shadow-sky-500/25 md:px-10 md:py-5 md:text-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-gradient-brand text-2xl font-bold">agent-me.app</span>
            <p className="text-sm text-muted">Built with privacy in mind. Your data stays yours.</p>
            <a
              href="https://github.com/graemegeorge/agent-me.app"
              target="_blank"
              rel="noreferrer"
              aria-label="View the agent-me.app repository on GitHub"
              className="text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
