'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Script from 'next/script'
import { Tooltip } from '@/components/ui/Tooltip'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: '🤖',
      title: 'ChatGPT History Analysis',
      description: 'Upload your ChatGPT export and we\'ll analyze your conversation patterns, interests, and communication style.',
    },
    {
      icon: '📝',
      title: 'Smart Questionnaire',
      description: 'Answer thoughtful questions about your work style, preferences, and goals to build your agent profile.',
    },
    {
      icon: '🔗',
      title: 'Connect Your Accounts',
      description: 'Link Google or GitHub to enrich your profile with additional context about how you work.',
    },
    {
      icon: '✨',
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
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800">
                  <span
                    className="text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(to right, #38bdf8, #e879f9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    agent-me.app
                  </span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span
                style={{
                  background: 'linear-gradient(to right, #ffffff, #e5e7eb, #9ca3af)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Create Your
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(to right, #38bdf8, #e879f9, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% auto',
                }}
              >
                AI Twin
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Build a personalized AI agent that understands your work style,
              communication patterns, and expertise. Your digital counterpart, ready to assist.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Tooltip content="The most in depth analysis of your conversational personality.">
                <Link
                  href="/analyze"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 bg-gradient-to-r from-sky-500 to-fuchsia-500 hover:from-sky-600 hover:to-fuchsia-600"
                >
                  <span className="relative text-white flex items-center gap-2">
                    Upload ChatGPT Export
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </Tooltip>

              <Tooltip content="Shape the agent in a way you prefer.">
                <Link
                  href="/questionnaire"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                >
                  <span className="relative text-white flex items-center gap-2">
                    Take the Questionnaire
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </Tooltip>
            </div>

            {/* OAuth Sign In Buttons */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm">Or connect your accounts to get started</p>
              <div className="flex gap-4">
                <Tooltip content="Use your calendar, docs and email style to shape the agent.">
                  <button
                    onClick={() => signIn('google', { callbackUrl: '/capture' })}
                    className="flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </Tooltip>

                <Tooltip content="Use your code review style, comments and coding interests to shape the agent.">
                  <button
                    onClick={() => signIn('github', { callbackUrl: '/capture' })}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 hover:scale-105 border border-gray-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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

      {/* Features Section */}
      <section className="relative py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Multiple ways to build your personalized AI agent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 rounded-2xl blur-xl
                  transition-opacity duration-300 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}
                `} />
                <div className="relative glass rounded-2xl p-6 h-full transition-all duration-300 hover:translate-y-[-4px]">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's it for? */}
      <section className="relative py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What's it for?
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Turn your exported profile files and system prompts into practical help for real work,
              whether you write code every day or never touch it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-3">For non-technical work</h3>
              <ul className="space-y-3 text-gray-300">
                <li>Write emails, proposals, and docs in your voice even when you're busy.</li>
                <li>Prep for meetings faster with summaries and talking points that sound like you.</li>
                <li>Delegate repetitive writing and admin tasks without losing quality or tone.</li>
                <li>Onboard new teammates with clear "how I work" guidance from your profile.</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-3">For technical work</h3>
              <ul className="space-y-3 text-gray-300">
                <li>Generate PR descriptions, issue breakdowns, and implementation plans faster.</li>
                <li>Reuse your system prompt in IDE assistants for more consistent code support.</li>
                <li>Draft architecture notes and tradeoff analysis in your normal decision style.</li>
                <li>Create support agents for docs and triage with your preferred level of detail.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 glass rounded-2xl p-6 border border-primary-500/20">
            <h3 className="text-xl font-semibold text-white mb-3">Why the exportables matter</h3>
            <p className="text-gray-300">
              The downloadable files (like <code>AGENT.md</code>, <code>SKILLS.md</code>, and <code>SYSTEM_PROMPT.md</code>)
              give you portable building blocks you can plug into ChatGPT, Claude, custom GPTs, internal tools,
              or team workflows so your assistant stays consistent wherever you use it.
            </p>
          </div>
        </div>
      </section>

      {/* How ChatGPT Export Works */}
      <section className="relative py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(to right, #38bdf8, #e879f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Export Your ChatGPT History
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Your ChatGPT conversations contain a goldmine of information about how you think,
                communicate, and solve problems. Here's how to export them:
              </p>

              <div className="space-y-4">
                {[
                  'Open ChatGPT and go to Settings',
                  'Navigate to Data Controls',
                  'Click "Export Data"',
                  'Download the ZIP file',
                  'Upload the conversations.json file here',
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="text-sky-400 font-semibold">Privacy First:</span> Your data is processed locally and never stored on our servers.
                  We only extract patterns and insights, not your actual conversations.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-8">
                <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-500 text-sm ml-2">conversations.json</span>
                  </div>
                  <pre className="text-sm text-gray-400 overflow-hidden">
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

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Meet Your AI Twin?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Start building your personalized agent today. It only takes a few minutes.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white hover:from-sky-600 hover:to-fuchsia-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(to right, #38bdf8, #e879f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              agent-me.app
            </span>
            <p className="text-gray-500 text-sm">
              Built with privacy in mind. Your data stays yours.
            </p>
            <a
              href="https://github.com/graemegeorge/agent-me.app"
              target="_blank"
              rel="noreferrer"
              aria-label="View the agent-me.app repository on GitHub"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
