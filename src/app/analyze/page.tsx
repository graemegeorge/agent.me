'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChatGPTExport, AnalysisProgress } from '@/types'
import { analyzeChatHistory } from '@/lib/analyzer'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { AppHeader } from '@/components/layout/AppHeader'
import { ArrowRight, Upload } from 'lucide-react'

export default function AnalyzePage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<AnalysisProgress | null>(null)
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
        setError('This does not look like a ChatGPT export. Please upload the conversations.json file from your ChatGPT data export.')
        setProgress(null)
        return
      }

      const conversations = Array.isArray(data) ? data : data.conversations

      setProgress({ stage: 'analyzing', progress: 40, message: 'Analyzing your communication patterns...' })

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (!prev || prev.progress >= 90) return prev
          return { ...prev, progress: prev.progress + 10 }
        })
      }, 500)

      const generatedProfile = await analyzeChatHistory({ conversations })

      clearInterval(progressInterval)
      setProgress({ stage: 'complete', progress: 100, message: 'Analysis complete.' })
      localStorage.setItem('agentProfile', JSON.stringify(generatedProfile))

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
    <main className="min-h-screen bg-app text-app">
      <AppHeader
        nav={
          <>
            <Link href="/questionnaire" className="hidden sm:inline hover:text-accent">Questionnaire</Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10">
          <p className="micro text-muted">Chat history analysis</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Upload your ChatGPT export.</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-strong sm:text-lg">
            We map your language patterns and decision style to build the first draft of your AI twin.
          </p>
        </div>

        {!progress && (
          <div
            className={`frame p-8 text-center transition-colors ${isDragging ? 'border-strong' : ''}`}
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-strong">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-sm text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="text-xs uppercase tracking-[0.2em] text-muted hover:text-accent"
                >
                  Choose a different file
                </button>
                <p id="upload-file-help" className="sr-only">
                  Press Enter or Space to choose a different file.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-app">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Drop your conversations.json file here</p>
                  <p id="upload-file-help" className="text-sm text-muted">
                    or click, press Enter, or press Space to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {progress && (
          <div className="frame p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="micro text-muted">Status</p>
                <p className="mt-2 text-base font-semibold">{progress.message}</p>
              </div>
              <span className="text-sm text-muted">{progress.progress}%</span>
            </div>
            <div className="mt-6 border border-app">
              <div
                className="h-2 bg-app"
                style={{ width: `${progress.progress}%`, backgroundColor: 'var(--color-text)' }}
              />
            </div>
            {progress.stage === 'complete' && (
              <p className="mt-6 text-sm text-muted">Redirecting to your profile...</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 frame border-strong p-4">
            <p className="text-sm text-accent">{error}</p>
          </div>
        )}

        {file && !progress && (
          <button
            onClick={processFile}
            className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] sm:w-auto"
          >
            Analyze My Conversations
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div className="mt-10 frame p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">How to export your ChatGPT data</h3>
          <ol className="mt-4 space-y-3 text-sm text-muted-strong">
            <li>Go to chat.openai.com and sign in.</li>
            <li>Click your profile photo and open Settings.</li>
            <li>Open Data Controls.</li>
            <li>Choose Export data and confirm.</li>
            <li>Download the ZIP, extract, upload conversations.json.</li>
          </ol>
        </div>

        <div className="mt-6 frame p-4">
          <p className="text-sm text-muted-strong">
            Privacy first: all analysis happens in your browser. We don&apos;t store or transmit your conversations.
          </p>
        </div>
      </div>
    </main>
  )
}
