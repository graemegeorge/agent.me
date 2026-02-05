'use client'

import Link from 'next/link'
import Script from 'next/script'
import { signIn } from 'next-auth/react'
import { ArrowRight, ClipboardList, Link2, MessagesSquare, Sparkles } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function Home() {
  const features = [
    {
      icon: MessagesSquare,
      title: 'Conversation Analysis',
      description: 'Upload your ChatGPT export to map patterns, priorities, and the language you default to under pressure.',
    },
    {
      icon: ClipboardList,
      title: 'Curated Questionnaire',
      description: 'Answer high-signal prompts about how you decide, collaborate, and define quality.',
    },
    {
      icon: Link2,
      title: 'Connected Context',
      description: 'Link Google or GitHub to add work signals that sharpen your agent’s memory and tone.',
    },
    {
      icon: Sparkles,
      title: 'Agent Synthesis',
      description: 'We compile your data into a portable system prompt and working profile you can reuse anywhere.',
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

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <header className="rule-strong">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.28em]">agent-me.app</span>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
            <a href="#method" className="hover:text-accent">Method</a>
            <a href="#uses" className="hover:text-accent">Use Cases</a>
            <a href="#exportables" className="hover:text-accent">Exportables</a>
          </nav>
        </div>
      </header>

      <section className="border-b border-strong">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-7">
            <p className="micro text-muted">Personal agent generation</p>
            <h1 className="font-display mt-6 text-5xl leading-[0.9] sm:text-6xl lg:text-[8vw]">
              A self that
              <br />
              answers back.
            </h1>
            <p className="mt-8 max-w-xl text-base text-muted-strong sm:text-lg">
              Build a precise AI twin from your real words, decisions, and working habits. Designed to act like you do,
              not like a template.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Tooltip content="Analyze your ChatGPT export.">
                <Link
                  href="/analyze"
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] sm:w-auto"
                >
                  Upload ChatGPT Export
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Tooltip>
              <Tooltip content="Shape your agent with a short questionnaire.">
                <Link
                  href="/questionnaire"
                  className="btn-secondary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] sm:w-auto"
                >
                  Take the Questionnaire
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Tooltip>
            </div>
            <div className="mt-8">
              <p className="micro text-muted">Or connect accounts</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Tooltip content="Use your calendar, docs, and email style to shape the agent.">
                  <button
                    onClick={() => signIn('google', { callbackUrl: '/capture' })}
                    className="btn-tertiary inline-flex w-full items-center justify-center gap-3 px-5 py-2.5 text-xs uppercase tracking-[0.2em] sm:w-auto"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                </Tooltip>
                <Tooltip content="Use your code review style and coding interests to shape the agent.">
                  <button
                    onClick={() => signIn('github', { callbackUrl: '/capture' })}
                    className="btn-tertiary inline-flex w-full items-center justify-center gap-3 px-5 py-2.5 text-xs uppercase tracking-[0.2em] sm:w-auto"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="frame h-full p-6">
              <p className="micro text-muted">What you get</p>
              <ul className="mt-6 space-y-6 text-sm text-muted-strong sm:text-base">
                <li className="border-b border-app pb-4">A working system prompt built from your real decisions.</li>
                <li className="border-b border-app pb-4">A profile of how you communicate, delegate, and evaluate quality.</li>
                <li className="border-b border-app pb-4">Exportables that travel across tools without loss of tone.</li>
                <li>Privacy-first processing, built for professionals and teams.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="method" className="border-b border-strong">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="micro text-muted">Method</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">The work of making you, legible.</h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.title} className="frame p-5">
                      <Icon className="h-4 w-4 text-accent" />
                      <h3 className="mt-4 text-base font-semibold uppercase tracking-[0.18em]">{feature.title}</h3>
                      <p className="mt-3 text-sm text-muted-strong sm:text-base">{feature.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="uses" className="border-b border-strong">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="micro text-muted">Use cases</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">For work that needs your voice, not a template.</h2>
              <p className="mt-6 text-base text-muted-strong sm:text-lg">
                The agent is built to think the way you do: pragmatic, specific, and portable across the tools you already use.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="frame p-5">
                  <p className="micro text-muted">Non-technical</p>
                  <ul className="mt-4 space-y-3 text-sm text-muted-strong sm:text-base">
                    <li>Drafts that sound like you, even when you’re rushed.</li>
                    <li>Meeting prep and summaries in your own cadence.</li>
                    <li>Delegation notes that keep your standards intact.</li>
                    <li>Onboarding guidance that reflects how you operate.</li>
                  </ul>
                </div>
                <div className="frame p-5">
                  <p className="micro text-muted">Technical</p>
                  <ul className="mt-4 space-y-3 text-sm text-muted-strong sm:text-base">
                    <li>PR descriptions and implementation plans in your style.</li>
                    <li>Architecture notes that reflect your tradeoffs.</li>
                    <li>System prompts you can reuse in IDE assistants.</li>
                    <li>Support agents that match your detail level.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="exportables" className="border-b border-strong">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="micro text-muted">Exportables</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Portable by design.</h2>
              <p className="mt-6 text-base text-muted-strong sm:text-lg">
                Your agent isn’t locked in. The files you download are portable building blocks for other tools and teams.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="frame p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border-b border-app pb-4">
                    <p className="micro text-muted">AGENT.md</p>
                    <p className="mt-3 text-sm text-muted-strong sm:text-base">A full description of how your agent should behave.</p>
                  </div>
                  <div className="border-b border-app pb-4">
                    <p className="micro text-muted">SKILLS.md</p>
                    <p className="mt-3 text-sm text-muted-strong sm:text-base">Your curated capabilities, tools, and boundaries.</p>
                  </div>
                  <div>
                    <p className="micro text-muted">SYSTEM_PROMPT.md</p>
                    <p className="mt-3 text-sm text-muted-strong sm:text-base">A portable system prompt you can drop into any LLM.</p>
                  </div>
                  <div>
                    <p className="micro text-muted">PROFILE.json</p>
                    <p className="mt-3 text-sm text-muted-strong sm:text-base">Structured data for programmatic reuse.</p>
                  </div>
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">Privacy-first processing. Data stays local.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-strong">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="micro text-muted">Get started</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Ready to meet your AI twin?</h2>
              <p className="mt-6 max-w-xl text-base text-muted-strong sm:text-lg">
                It takes minutes to begin. The result is an agent that sounds like you and scales your attention.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
              <Link
                href="/analyze"
            className="btn-primary inline-flex w-full items-center justify-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-b border-strong">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <span className="text-xs uppercase tracking-[0.28em]">agent-me.app</span>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Built with privacy in mind. Your data stays yours.</p>
          <a
            href="https://github.com/graemegeorge/agent.me"
            target="_blank"
            rel="noreferrer"
            aria-label="View the agent-me.app repository on GitHub"
            className="text-muted hover:text-accent"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  )
}
