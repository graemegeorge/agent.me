'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentProfile } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'personality' | 'prompt'>('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('agentProfile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert createdAt back to Date if it's a string
        if (typeof parsed.createdAt === 'string') {
          parsed.createdAt = new Date(parsed.createdAt)
        }
        setProfile(parsed)
      } catch (e) {
        console.error('Error parsing profile:', e)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const copySystemPrompt = () => {
    if (profile?.systemPrompt) {
      navigator.clipboard.writeText(profile.systemPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadProfile = () => {
    if (!profile) return
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agent-profile.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </main>
    )
  }

  const personalityTraits = [
    { label: 'Communication', value: profile.personality.communicationStyle, icon: '💬' },
    { label: 'Verbosity', value: profile.personality.verbosity, icon: '📝' },
    { label: 'Tone', value: profile.personality.tone, icon: '🎭' },
    { label: 'Decision Making', value: profile.personality.decisionMaking, icon: '🧠' },
  ]

  const workTraits = [
    { label: 'Problem Solving', value: profile.workStyle.problemSolvingApproach, icon: '🔧' },
    { label: 'Learning Style', value: profile.workStyle.learningStyle, icon: '📚' },
  ]

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              agent.me
            </Link>
            <div className="flex gap-4">
              <button
                onClick={downloadProfile}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Create New
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-lg opacity-50" />
            <div className="relative w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your AI Agent
            </span>
          </h1>
          <p className="text-gray-400">
            Created {profile.createdAt instanceof Date ? profile.createdAt.toLocaleDateString() : new Date(profile.createdAt).toLocaleDateString()}
            {profile.analysis.totalMessages > 0 && ` • Based on ${profile.analysis.totalMessages.toLocaleString()} messages`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {(['overview', 'personality', 'prompt'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personality Summary */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎯</span> Personality Traits
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {personalityTraits.map((trait) => (
                  <div key={trait.label} className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-2xl mb-2">{trait.icon}</div>
                    <p className="text-gray-400 text-sm">{trait.label}</p>
                    <p className="text-white font-semibold capitalize">{trait.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Style */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>💼</span> Work Style
              </h3>
              <div className="space-y-4">
                {workTraits.map((trait) => (
                  <div key={trait.label} className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4">
                    <div className="text-2xl">{trait.icon}</div>
                    <div>
                      <p className="text-gray-400 text-sm">{trait.label}</p>
                      <p className="text-white font-semibold capitalize">{trait.value}</p>
                    </div>
                  </div>
                ))}
                {profile.workStyle.preferredTools.length > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Preferred Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.workStyle.preferredTools.map((tool) => (
                        <span key={tool} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Topics & Interests */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎨</span> Topics & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.primaryTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl text-white"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Communication Style */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>💬</span> Communication
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Message Length</span>
                  <span className="text-white capitalize">{profile.communication.averageMessageLength}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uses Emojis</span>
                  <span className={profile.communication.usesEmojis ? 'text-green-400' : 'text-gray-500'}>
                    {profile.communication.usesEmojis ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uses Code Examples</span>
                  <span className={profile.communication.usesCodeExamples ? 'text-green-400' : 'text-gray-500'}>
                    {profile.communication.usesCodeExamples ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Asks Clarifying Questions</span>
                  <span className={profile.communication.asksClarifyingQuestions ? 'text-green-400' : 'text-gray-500'}>
                    {profile.communication.asksClarifyingQuestions ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personality Tab */}
        {activeTab === 'personality' && (
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Detailed Personality Analysis</h3>

            <div className="space-y-8">
              {/* Communication Style */}
              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-3">Communication Style</h4>
                <p className="text-gray-300">
                  You communicate in a <span className="text-white font-semibold">{profile.personality.communicationStyle}</span> manner
                  with <span className="text-white font-semibold">{profile.personality.verbosity}</span> verbosity.
                  Your overall tone is <span className="text-white font-semibold">{profile.personality.tone}</span>.
                </p>
              </div>

              {/* Decision Making */}
              <div>
                <h4 className="text-lg font-semibold text-accent-400 mb-3">Decision Making</h4>
                <p className="text-gray-300">
                  You tend to make decisions in an <span className="text-white font-semibold">{profile.personality.decisionMaking}</span> way,
                  {profile.personality.decisionMaking === 'analytical'
                    ? ' relying on data and logical analysis to reach conclusions.'
                    : profile.personality.decisionMaking === 'intuitive'
                    ? ' trusting your gut feelings and experience.'
                    : ' balancing both intuition and analysis.'}
                </p>
              </div>

              {/* Work Approach */}
              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-3">Work Approach</h4>
                <p className="text-gray-300">
                  Your problem-solving approach is <span className="text-white font-semibold">{profile.workStyle.problemSolvingApproach}</span>.
                  You prefer <span className="text-white font-semibold">{profile.workStyle.learningStyle}</span> learning.
                </p>
              </div>

              {/* Keywords */}
              {profile.analysis.topKeywords.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-accent-400 mb-3">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.analysis.topKeywords.slice(0, 15).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Prompt Tab */}
        {activeTab === 'prompt' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Generated System Prompt</h3>
              <button
                onClick={copySystemPrompt}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
                  ${copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                  }
                `}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Prompt
                  </>
                )}
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              Use this system prompt with ChatGPT, Claude, or any other AI assistant to create an AI that mimics your style.
            </p>

            <div className="bg-gray-900 rounded-xl p-6 overflow-auto max-h-[600px]">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">
                {profile.systemPrompt}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
              <h4 className="text-primary-400 font-semibold mb-2">How to use this prompt:</h4>
              <ol className="text-gray-300 text-sm space-y-2">
                <li>1. Copy the system prompt above</li>
                <li>2. Open ChatGPT, Claude, or your preferred AI assistant</li>
                <li>3. Start a new conversation and paste the prompt as the first message</li>
                <li>4. Or use it as a "Custom Instructions" or "System Prompt" in API settings</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
