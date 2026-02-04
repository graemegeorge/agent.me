'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChatGPTExport, AnalysisProgress, AgentProfile } from '@/types'
import { analyzeChatHistory } from '@/lib/analyzer'

export default function AnalyzePage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<AnalysisProgress | null>(null)
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }, [])

  const validateAndSetFile = (file: File) => {
    setError(null)
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file. Export your data from ChatGPT and upload the conversations.json file.')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File is too large. Maximum size is 100MB.')
      return
    }
    setFile(file)
  }

  const processFile = async () => {
    if (!file) return

    setProgress({ stage: 'uploading', progress: 0, message: 'Reading file...' })

    try {
      const text = await file.text()
      setProgress({ stage: 'parsing', progress: 20, message: 'Parsing conversations...' })

      let data: ChatGPTExport
      try {
        data = JSON.parse(text)
      } catch {
        setError('Invalid JSON file. Please make sure you uploaded the correct file.')
        setProgress(null)
        return
      }

      if (!data.conversations && !Array.isArray(data)) {
        setError('This doesn\'t look like a ChatGPT export. Please upload the conversations.json file from your ChatGPT data export.')
        setProgress(null)
        return
      }

      // Handle both formats (array or object with conversations property)
      const conversations = Array.isArray(data) ? data : data.conversations

      setProgress({ stage: 'analyzing', progress: 40, message: 'Analyzing your communication patterns...' })

      // Simulate progress while analyzing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (!prev || prev.progress >= 90) return prev
          return { ...prev, progress: prev.progress + 10 }
        })
      }, 500)

      const generatedProfile = await analyzeChatHistory({ conversations })

      clearInterval(progressInterval)
      setProgress({ stage: 'complete', progress: 100, message: 'Analysis complete!' })
      setProfile(generatedProfile)

      // Store in localStorage for the profile page
      localStorage.setItem('agentProfile', JSON.stringify(generatedProfile))

      // Navigate to profile page after a short delay
      setTimeout(() => {
        router.push('/profile')
      }, 1500)

    } catch (err) {
      setError('An error occurred while processing the file. Please try again.')
      setProgress(null)
      console.error(err)
    }
  }

  const openFilePicker = () => fileInputRef.current?.click()

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold brand-logo">
              agent-me.app
            </Link>
            <nav aria-label="Analyze page">
              <Link href="/questionnaire" className="text-gray-400 hover:text-white transition-colors">
                Or take the questionnaire →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Upload Your ChatGPT Export
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            We'll analyze your conversations to understand your unique patterns
          </p>
        </div>

        {/* Upload Area */}
        {!progress && (
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center
              transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-900/50'
              }
              ${file ? 'border-green-500 bg-green-500/10' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openFilePicker()
              }
            }}
            role="button"
            tabIndex={0}
            aria-describedby="upload-file-help"
          >
            <label htmlFor="fileInput" className="sr-only">
              Upload ChatGPT conversations JSON file
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".json"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />

            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="text-gray-400 hover:text-white text-sm underline"
                >
                  Choose a different file
                </button>
                <p id="upload-file-help" className="sr-only">
                  Press Enter or Space to choose a different file.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Drop your conversations.json file here</p>
                  <p id="upload-file-help" className="text-gray-400 text-sm">
                    or click, press Enter, or press Space to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                {progress.stage === 'complete' ? (
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{progress.message}</p>
                  <p className="text-gray-400 text-sm">{progress.progress}% complete</p>
                </div>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>

              {progress.stage === 'complete' && (
                <p className="text-center text-gray-400 mt-6">
                  Redirecting to your profile...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        {file && !progress && (
          <button
            onClick={processFile}
            className="w-full mt-6 py-4 px-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all duration-300"
          >
            Analyze My Conversations
          </button>
        )}

        {/* Instructions */}
        <div className="mt-12 glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to export your ChatGPT data:</h3>
          <ol className="space-y-3 text-gray-400">
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">1.</span>
              Go to <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">chat.openai.com</a> and sign in
            </li>
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">2.</span>
              Click your profile picture → Settings
            </li>
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">3.</span>
              Go to "Data Controls" section
            </li>
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">4.</span>
              Click "Export data" and confirm
            </li>
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">5.</span>
              Wait for the email with your download link
            </li>
            <li className="flex gap-3">
              <span className="text-primary-400 font-semibold">6.</span>
              Extract the ZIP and upload <code className="text-accent-400">conversations.json</code>
            </li>
          </ol>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-white font-semibold text-sm">Your privacy is protected</p>
              <p className="text-gray-400 text-sm">All analysis happens in your browser. We don't store or transmit your conversations.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
