'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentProfile } from '@/types'
import { generateAgentMd, generateSkillsMd, generateSystemPromptMd } from '@/lib/generator'
import JSZip from 'jszip'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import {
  Bot,
  Brain,
  Briefcase,
  ClipboardCopy,
  Download,
  FileCode,
  FileJson,
  Gauge,
  MessageCircle,
  Palette,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'personality' | 'files'>('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('agentProfile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
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

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAgentMd = () => {
    if (!profile) return
    downloadFile(generateAgentMd(profile), 'AGENT.md')
  }

  const downloadSkillsMd = () => {
    if (!profile) return
    downloadFile(generateSkillsMd(profile), 'SKILLS.md')
  }

  const downloadSystemPromptMd = () => {
    if (!profile) return
    downloadFile(generateSystemPromptMd(profile), 'SYSTEM_PROMPT.md')
  }

  const downloadProfileJson = () => {
    if (!profile) return
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profile.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllAsZip = async () => {
    if (!profile) return

    const zip = new JSZip()
    zip.file('AGENT.md', generateAgentMd(profile))
    zip.file('SKILLS.md', generateSkillsMd(profile))
    zip.file('SYSTEM_PROMPT.md', generateSystemPromptMd(profile))
    zip.file('profile.json', JSON.stringify(profile, null, 2))

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-ai-agent.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-app text-app flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </main>
    )
  }

  const personalityTraits = [
    { label: 'Communication', value: profile.personality.communicationStyle, icon: MessageCircle },
    { label: 'Verbosity', value: profile.personality.verbosity, icon: Gauge },
    { label: 'Tone', value: profile.personality.tone, icon: Palette },
    { label: 'Decision Making', value: profile.personality.decisionMaking, icon: Brain },
  ]

  const workTraits = [
    { label: 'Problem Solving', value: profile.workStyle.problemSolvingApproach, icon: Wrench },
    { label: 'Learning Style', value: profile.workStyle.learningStyle, icon: Sparkles },
  ]

  const files = [
    { name: 'AGENT.md', description: 'Your agent persona and profile', icon: Bot, action: downloadAgentMd },
    { name: 'SKILLS.md', description: 'Capabilities and expertise', icon: Sparkles, action: downloadSkillsMd },
    { name: 'SYSTEM_PROMPT.md', description: 'Ready-to-use AI prompt', icon: FileCode, action: downloadSystemPromptMd },
    { name: 'profile.json', description: 'Raw profile data', icon: FileJson, action: downloadProfileJson },
  ]

  const tabPanelId = (tab: 'overview' | 'personality' | 'files') => `${tab}-panel`
  const tabId = (tab: 'overview' | 'personality' | 'files') => `${tab}-tab`

  return (
    <main className="min-h-screen bg-app text-app">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold brand-logo">
              agent-me.app
            </Link>
            <nav aria-label="Profile actions" className="flex gap-2 md:gap-3 items-center">
              <Link
                href="/chat"
                className="px-3 py-2 md:px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all flex items-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="hidden sm:inline">Chat with Agent</span>
                <span className="sm:hidden">Chat</span>
              </Link>
              <Link href="/" className="px-3 py-2 md:px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base">
                <span className="hidden sm:inline">Create New</span>
                <span className="sm:hidden">New</span>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-5 md:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-lg opacity-50" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-heading">
              Your AI Agent is Ready!
            </span>
          </h1>
          <p className="text-gray-400">
            Created {profile.createdAt instanceof Date ? profile.createdAt.toLocaleDateString() : new Date(profile.createdAt).toLocaleDateString()}
            {profile.analysis.totalMessages > 0 && ` • Based on ${profile.analysis.totalMessages.toLocaleString()} messages`}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12">
          <Link
            href="/chat"
            className="flex w-full sm:w-auto items-center gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl hover:from-primary-500/30 hover:to-accent-500/30 transition-all"
          >
            <MessageCircle className="h-5 w-5 text-primary-300" />
            <div className="text-left">
              <p className="text-white font-semibold">Chat with Your Agent</p>
              <p className="text-gray-400 text-sm">Test your AI twin in real-time</p>
            </div>
          </Link>

          <button
            onClick={downloadAllAsZip}
            className="flex w-full sm:w-auto items-center gap-3 px-4 py-3 md:px-6 md:py-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all"
          >
            <Download className="h-5 w-5 text-primary-300" />
            <div className="text-left">
              <p className="text-white font-semibold">Download All Files</p>
              <p className="text-gray-400 text-sm">Get AGENT.md, SKILLS.md & more</p>
            </div>
          </button>

          <button
            onClick={copySystemPrompt}
            className="flex w-full sm:w-auto items-center gap-3 px-4 py-3 md:px-6 md:py-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all"
          >
            <ClipboardCopy className={`h-5 w-5 ${copied ? 'text-green-400' : 'text-primary-300'}`} />
            <div className="text-left">
              <p className="text-white font-semibold">{copied ? 'Copied!' : 'Copy System Prompt'}</p>
              <p className="text-gray-400 text-sm">Use with ChatGPT or Claude</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8" role="tablist" aria-label="Profile sections">
          {(['overview', 'personality', 'files'] as const).map((tab) => (
            <button
              id={tabId(tab)}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={tabPanelId(tab)}
              className={`
                px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab === 'files' ? 'Files & Export' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div
            id={tabPanelId('overview')}
            role="tabpanel"
            aria-labelledby={tabId('overview')}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Personality Summary */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-300" /> Personality Traits
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {personalityTraits.map((trait) => {
                  const Icon = trait.icon
                  return (
                    <div key={trait.label} className="bg-gray-800/50 rounded-xl p-4">
                      <Icon className="h-5 w-5 mb-2 text-primary-300" />
                      <p className="text-gray-400 text-sm">{trait.label}</p>
                      <p className="text-white font-semibold capitalize">{trait.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Work Style */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-300" /> Work Style
              </h3>
              <div className="space-y-4">
                {workTraits.map((trait) => {
                  const Icon = trait.icon
                  return (
                    <div key={trait.label} className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4">
                      <Icon className="h-5 w-5 text-primary-300" />
                      <div>
                        <p className="text-gray-400 text-sm">{trait.label}</p>
                        <p className="text-white font-semibold capitalize">{trait.value}</p>
                      </div>
                    </div>
                  )
                })}
                {profile.workStyle.preferredTools.length > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Preferred Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.workStyle.preferredTools.map((tool) => (
                        <span key={tool} className="px-3 py-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full text-sm text-app">
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
                <Palette className="h-5 w-5 text-primary-300" /> Topics & Interests
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
                <MessageCircle className="h-5 w-5 text-primary-300" /> Communication
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
          <div
            id={tabPanelId('personality')}
            role="tabpanel"
            aria-labelledby={tabId('personality')}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Detailed Personality Analysis</h3>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-3">Communication Style</h4>
                <p className="text-gray-300">
                  You communicate in a <span className="text-white font-semibold">{profile.personality.communicationStyle}</span> manner
                  with <span className="text-white font-semibold">{profile.personality.verbosity}</span> verbosity.
                  Your overall tone is <span className="text-white font-semibold">{profile.personality.tone}</span>.
                </p>
              </div>

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

              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-3">Work Approach</h4>
                <p className="text-gray-300">
                  Your problem-solving approach is <span className="text-white font-semibold">{profile.workStyle.problemSolvingApproach}</span>.
                  You prefer <span className="text-white font-semibold">{profile.workStyle.learningStyle}</span> learning.
                </p>
              </div>

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

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div
            id={tabPanelId('files')}
            role="tabpanel"
            aria-labelledby={tabId('files')}
            className="space-y-6"
          >
            {/* Download All */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Download Complete Package</h3>
                  <p className="text-gray-400">Get all files in a single ZIP archive</p>
                </div>
                <button
                  onClick={downloadAllAsZip}
                  className="px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all flex items-center gap-2"
                >
                  <Download className="h-4 w-4 md:h-5 md:w-5" />
                  Download ZIP
                </button>
              </div>
            </div>

            {/* Individual Files */}
            <div className="grid md:grid-cols-2 gap-4">
              {files.map((file) => {
                const Icon = file.icon
                return (
                  <div key={file.name} className="glass rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="h-6 w-6 text-primary-300" />
                      <div>
                        <p className="text-white font-semibold">{file.name}</p>
                        <p className="text-gray-400 text-sm">{file.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={file.action}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                )
              })}
            </div>

            {/* System Prompt Preview */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">System Prompt Preview</h3>
                <button
                  onClick={copySystemPrompt}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    copied ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-[300px]">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">
                  {profile.systemPrompt}
                </pre>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use Your Agent</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-primary-400 font-semibold mb-2">ChatGPT</h4>
                  <p className="text-gray-400 text-sm">
                    Go to Settings → Personalization → Custom Instructions and paste the system prompt.
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-accent-400 font-semibold mb-2">Claude</h4>
                  <p className="text-gray-400 text-sm">
                    Create a Project and add the system prompt to Project Instructions.
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-primary-400 font-semibold mb-2">API</h4>
                  <p className="text-gray-400 text-sm">
                    Use as the system message in your OpenAI or Anthropic API calls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
