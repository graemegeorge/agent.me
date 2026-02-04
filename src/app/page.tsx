'use client'

import Link from 'next/link'
import { useState } from 'react'

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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    agent.me
                  </span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Create Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                AI Twin
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Build a personalized AI agent that understands your work style,
              communication patterns, and expertise. Your digital counterpart, ready to assist.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/analyze"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-white flex items-center gap-2">
                  Upload ChatGPT Export
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/questionnaire"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gray-800 border border-gray-700" />
                <div className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-white flex items-center gap-2">
                  Take the Questionnaire
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                How It Works
              </span>
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
                  absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl
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

      {/* How ChatGPT Export Works */}
      <section className="relative py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Export Your ChatGPT History
                </span>
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
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="text-primary-400 font-semibold">Privacy First:</span> Your data is processed locally and never stored on our servers.
                  We only extract patterns and insights, not your actual conversations.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-primary-200 to-accent-200 bg-clip-text text-transparent">
              Ready to Meet Your AI Twin?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Start building your personalized agent today. It only takes a few minutes.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              agent.me
            </div>
            <p className="text-gray-500 text-sm">
              Built with privacy in mind. Your data stays yours.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
