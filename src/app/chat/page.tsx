'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentProfile } from '@/types'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Bot, KeyRound } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic'>('openai')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiKeyInputRef = useRef<HTMLInputElement>(null)

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

    const savedKey = localStorage.getItem('aiApiKey')
    const savedProvider = localStorage.getItem('aiProvider') as 'openai' | 'anthropic'
    if (savedKey) setApiKey(savedKey)
    if (savedProvider) setSelectedProvider(savedProvider)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!showApiKeyModal) return

    apiKeyInputRef.current?.focus()

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowApiKeyModal(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [showApiKeyModal])

  const saveApiKey = () => {
    localStorage.setItem('aiApiKey', apiKey)
    localStorage.setItem('aiProvider', selectedProvider)
    setShowApiKeyModal(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || !profile) return

    if (!apiKey) {
      setShowApiKeyModal(true)
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: profile.systemPrompt,
          apiKey,
          provider: selectedProvider,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response. Please check your API key and try again.'}`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-app text-app flex items-center justify-center">
        <div className="frame p-6">
          <p className="text-sm text-muted">Loading chat…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-app text-app flex flex-col">
      <AppHeader
        nav={
          <>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="btn-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <span className="inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> API Key
              </span>
            </button>
            <Link href="/profile" className="btn-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Profile
            </Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="flex-1 mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex-1 overflow-y-auto space-y-4 border border-app p-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-10 w-10 items-center justify-center border border-app">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Chat with your AI agent.</h2>
              <p className="mt-2 text-sm text-muted-strong max-w-md mx-auto">
                Your agent is configured with your personality profile. Start a conversation to see how it responds like you.
              </p>
              {!apiKey && (
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="btn-primary mt-4 inline-flex w-full items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto"
                >
                  Set up API key
                </button>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] border border-app px-4 py-3 text-sm ${message.role === 'user' ? 'bg-surface-strong' : 'bg-surface'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="mt-2 text-xs text-muted">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="border border-app px-4 py-3">
                <div className="flex gap-1 text-muted">
                  <span>…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              id="chat-message-input"
              aria-label="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={2}
              className="flex-1 border border-strong bg-app px-4 py-3 text-sm focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="btn-primary w-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-muted text-center">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      </div>

      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-modal-title"
            aria-describedby="api-modal-description"
            className="bg-app border border-app p-6 w-full max-w-md"
          >
            <h3 id="api-modal-title" className="text-lg font-semibold">Configure AI provider</h3>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted" id="provider-label">Provider</p>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('openai')}
                    aria-labelledby="provider-label"
                    aria-pressed={selectedProvider === 'openai'}
                    className={`flex-1 border px-4 py-3 text-xs uppercase tracking-[0.2em] ${selectedProvider === 'openai' ? 'border-strong' : 'border-app text-muted'}`}
                  >
                    OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('anthropic')}
                    aria-labelledby="provider-label"
                    aria-pressed={selectedProvider === 'anthropic'}
                    className={`flex-1 border px-4 py-3 text-xs uppercase tracking-[0.2em] ${selectedProvider === 'anthropic' ? 'border-strong' : 'border-app text-muted'}`}
                  >
                    Anthropic
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="provider-api-key" className="text-xs uppercase tracking-[0.2em] text-muted">
                  API Key
                </label>
                <input
                  id="provider-api-key"
                  type="password"
                  ref={apiKeyInputRef}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={selectedProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  className="mt-2 w-full border border-strong bg-app px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <p id="api-modal-description" className="text-xs text-muted">
                Your API key is stored locally and sent directly to {selectedProvider === 'openai' ? 'OpenAI' : 'Anthropic'}. We never store it.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="btn-secondary w-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  disabled={!apiKey}
                  className="btn-primary w-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
