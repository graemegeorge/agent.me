'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentProfile } from '@/types'

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

    // Load saved API key
    const savedKey = localStorage.getItem('aiApiKey')
    const savedProvider = localStorage.getItem('aiProvider') as 'openai' | 'anthropic'
    if (savedKey) setApiKey(savedKey)
    if (savedProvider) setSelectedProvider(savedProvider)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold brand-logo">
                agent-me.app
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">Chat with Your Agent</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                API Key
              </button>
              <Link href="/profile" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Chat with Your AI Agent</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Your agent is configured with your personality profile. Start a conversation to see how it responds like you!
              </p>
              {!apiKey && (
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all"
                >
                  Set Up API Key to Start
                </button>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Configure AI Provider</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Provider</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProvider('openai')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      selectedProvider === 'openai'
                        ? 'border-primary-500 bg-primary-500/10 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    OpenAI
                  </button>
                  <button
                    onClick={() => setSelectedProvider('anthropic')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      selectedProvider === 'anthropic'
                        ? 'border-primary-500 bg-primary-500/10 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    Anthropic
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={selectedProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <p className="text-xs text-gray-500">
                Your API key is stored locally in your browser and sent directly to {selectedProvider === 'openai' ? 'OpenAI' : 'Anthropic'}. We never see or store your key.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  disabled={!apiKey}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50"
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
