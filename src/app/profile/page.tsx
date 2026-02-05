'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentProfile } from '@/types'
import { generateAgentMd, generateSkillsMd, generateSystemPromptMd } from '@/lib/generator'
import JSZip from 'jszip'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { AppHeader } from '@/components/layout/AppHeader'
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
        <div className="frame p-6">
          <p className="text-sm text-muted">Loading profile…</p>
        </div>
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
      <AppHeader
        nav={
          <>
            <Link href="/chat" className="btn-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">Chat</Link>
            <Link href="/" className="btn-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">New</Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="micro text-muted">Profile</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your AI agent is ready.</h1>
          <p className="mt-4 text-sm text-muted-strong">
            Created {profile.createdAt instanceof Date ? profile.createdAt.toLocaleDateString() : new Date(profile.createdAt).toLocaleDateString()}
            {profile.analysis.totalMessages > 0 && ` • Based on ${profile.analysis.totalMessages.toLocaleString()} messages`}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={downloadAllAsZip}
            className="btn-secondary flex w-full items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
          >
            <Download className="h-4 w-4" /> Download all files
          </button>
          <button
            onClick={copySystemPrompt}
            className="btn-secondary flex w-full items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
          >
            <ClipboardCopy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy system prompt'}
          </button>
          <Link
            href="/chat"
            className="btn-primary flex w-full items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" /> Chat with your agent
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Profile sections">
          {(['overview', 'personality', 'files'] as const).map((tab) => (
            <button
              id={tabId(tab)}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={tabPanelId(tab)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${activeTab === tab ? 'border border-strong' : 'border border-app text-muted'}`}
            >
              {tab === 'files' ? 'Files & export' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div id={tabPanelId('overview')} role="tabpanel" aria-labelledby={tabId('overview')} className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="frame p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="h-4 w-4" /> Personality traits
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                {personalityTraits.map((trait) => {
                  const Icon = trait.icon
                  return (
                    <div key={trait.label} className="frame p-4">
                      <Icon className="h-4 w-4" />
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{trait.label}</p>
                      <p className="mt-2 font-semibold capitalize">{trait.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="frame p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Work style
              </h3>
              <div className="mt-5 space-y-4 text-sm">
                {workTraits.map((trait) => {
                  const Icon = trait.icon
                  return (
                    <div key={trait.label} className="frame p-4 flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">{trait.label}</p>
                        <p className="mt-1 font-semibold capitalize">{trait.value}</p>
                      </div>
                    </div>
                  )
                })}
                {profile.workStyle.preferredTools.length > 0 && (
                  <div className="frame p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Preferred tools</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.workStyle.preferredTools.map((tool) => (
                        <span key={tool} className="border border-app px-3 py-1 text-xs uppercase tracking-[0.2em]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="frame p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <Palette className="h-4 w-4" /> Topics & interests
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.interests.primaryTopics.map((topic) => (
                  <span key={topic} className="border border-app px-3 py-1 text-xs uppercase tracking-[0.2em]">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="frame p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Communication
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Message length</span>
                  <span className="capitalize">{profile.communication.averageMessageLength}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Uses emojis</span>
                  <span>{profile.communication.usesEmojis ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Uses code examples</span>
                  <span>{profile.communication.usesCodeExamples ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Asks clarifying questions</span>
                  <span>{profile.communication.asksClarifyingQuestions ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div id={tabPanelId('personality')} role="tabpanel" aria-labelledby={tabId('personality')} className="mt-8 frame p-8">
            <h3 className="text-lg font-semibold">Detailed personality analysis</h3>
            <div className="mt-6 space-y-6 text-sm text-muted-strong">
              <div>
                <p className="micro text-muted">Communication</p>
                <p className="mt-2">
                  You communicate in a <span className="font-semibold text-app">{profile.personality.communicationStyle}</span> manner with{' '}
                  <span className="font-semibold text-app">{profile.personality.verbosity}</span> verbosity. Your overall tone is{' '}
                  <span className="font-semibold text-app">{profile.personality.tone}</span>.
                </p>
              </div>
              <div>
                <p className="micro text-muted">Decision making</p>
                <p className="mt-2">
                  You tend to make decisions in an <span className="font-semibold text-app">{profile.personality.decisionMaking}</span> way,
                  {profile.personality.decisionMaking === 'analytical'
                    ? ' relying on data and logical analysis to reach conclusions.'
                    : profile.personality.decisionMaking === 'intuitive'
                    ? ' trusting your gut feelings and experience.'
                    : ' balancing both intuition and analysis.'}
                </p>
              </div>
              <div>
                <p className="micro text-muted">Work approach</p>
                <p className="mt-2">
                  Your problem-solving approach is{' '}
                  <span className="font-semibold text-app">{profile.workStyle.problemSolvingApproach}</span>. You prefer{' '}
                  <span className="font-semibold text-app">{profile.workStyle.learningStyle}</span> learning.
                </p>
              </div>
              {profile.analysis.topKeywords.length > 0 && (
                <div>
                  <p className="micro text-muted">Top keywords</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.analysis.topKeywords.slice(0, 15).map((keyword) => (
                      <span key={keyword} className="border border-app px-3 py-1 text-xs uppercase tracking-[0.2em]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div id={tabPanelId('files')} role="tabpanel" aria-labelledby={tabId('files')} className="mt-8 space-y-6">
            <div className="frame p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Download complete package</h3>
                  <p className="mt-2 text-sm text-muted-strong">Get all files in a single ZIP archive.</p>
                </div>
                <button
                  onClick={downloadAllAsZip}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto"
                >
                  <Download className="h-4 w-4" /> Download ZIP
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {files.map((file) => {
                const Icon = file.icon
                return (
                  <div key={file.name} className="frame p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]">{file.name}</p>
                        <p className="text-sm text-muted-strong">{file.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={file.action}
                      className="btn-secondary w-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
                    >
                      Download
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="frame p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">System prompt preview</h3>
                <button
                  onClick={copySystemPrompt}
                  className={`btn-secondary w-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto ${copied ? 'border-strong' : ''}`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="mt-4 border border-app bg-surface-strong p-4 text-xs">
                <pre className="whitespace-pre-wrap font-mono text-muted-strong">
                  {profile.systemPrompt}
                </pre>
              </div>
            </div>

            <div className="frame p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">How to use your agent</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-muted-strong">
                <div className="frame p-4">
                  <p className="micro text-muted">ChatGPT</p>
                  <p className="mt-2">Settings → Personalization → Custom Instructions.</p>
                </div>
                <div className="frame p-4">
                  <p className="micro text-muted">Claude</p>
                  <p className="mt-2">Create a Project and add the system prompt to Project Instructions.</p>
                </div>
                <div className="frame p-4">
                  <p className="micro text-muted">API</p>
                  <p className="mt-2">Use as the system message in OpenAI or Anthropic calls.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
