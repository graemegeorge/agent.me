'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QuestionnaireResponse } from '@/types'
import { generateProfileFromQuestionnaire } from '@/lib/questionnaire'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ArrowRight } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'

interface Question {
  id: keyof QuestionnaireResponse
  question: string
  type: 'text' | 'select' | 'multiselect' | 'textarea'
  options?: string[]
  placeholder?: string
}

const questions: Question[] = [
  {
    id: 'workRole',
    question: "What's your primary role or profession?",
    type: 'text',
    placeholder: 'e.g., Software Engineer, Product Manager, Designer...',
  },
  {
    id: 'primaryTasks',
    question: 'What are your main day-to-day tasks? (Select all that apply)',
    type: 'multiselect',
    options: [
      'Writing code',
      'Designing interfaces',
      'Writing content',
      'Managing projects',
      'Analyzing data',
      'Research',
      'Communication & meetings',
      'Strategic planning',
      'Problem solving',
      'Learning new skills',
    ],
  },
  {
    id: 'communicationPreference',
    question: 'How would you describe your communication style?',
    type: 'select',
    options: [
      'Concise and to-the-point',
      'Detailed and thorough',
      'Casual and friendly',
      'Formal and professional',
      'Technical and precise',
    ],
  },
  {
    id: 'problemSolvingStyle',
    question: 'How do you typically approach problem-solving?',
    type: 'select',
    options: [
      'Break it down into systematic steps',
      'Brainstorm creative alternatives',
      'Research and gather information first',
      'Discuss with others for input',
      'Trust my intuition and dive in',
    ],
  },
  {
    id: 'toolsUsed',
    question: 'What tools and technologies do you use regularly? (Select all that apply)',
    type: 'multiselect',
    options: [
      'JavaScript/TypeScript',
      'Python',
      'React/Vue/Angular',
      'SQL/Databases',
      'Cloud (AWS/GCP/Azure)',
      'Figma/Design tools',
      'Excel/Spreadsheets',
      'Notion/Documentation',
      'Slack/Teams',
      'Git/GitHub',
    ],
  },
  {
    id: 'learningPreference',
    question: 'How do you prefer to learn new things?',
    type: 'select',
    options: [
      'Hands-on experimentation',
      'Reading documentation',
      'Watching tutorials',
      'Learning from peers',
      'Structured courses',
    ],
  },
  {
    id: 'teamCollaboration',
    question: 'How do you prefer to work with others?',
    type: 'select',
    options: [
      'Mostly independently',
      'Small focused teams',
      'Large collaborative groups',
      'Pair programming/working',
      'Mix of solo and team work',
    ],
  },
  {
    id: 'decisionMaking',
    question: 'How do you make important decisions?',
    type: 'select',
    options: [
      'Data-driven analysis',
      'Gut feeling and experience',
      'Seek advice from experts',
      'Weigh pros and cons carefully',
      'Quick decisions, adjust as needed',
    ],
  },
  {
    id: 'stressHandling',
    question: 'How do you handle pressure and tight deadlines?',
    type: 'select',
    options: [
      'Thrive under pressure',
      'Stay calm and methodical',
      'Prioritize ruthlessly',
      'Seek help when needed',
      'Prefer to plan ahead to avoid them',
    ],
  },
  {
    id: 'creativity',
    question: 'How would you rate your creative thinking?',
    type: 'select',
    options: [
      'Highly creative - always generating new ideas',
      'Creative when needed',
      'Prefer established solutions',
      'More analytical than creative',
      'Creative in specific domains',
    ],
  },
  {
    id: 'detailOrientation',
    question: 'How detail-oriented are you?',
    type: 'select',
    options: [
      'Extremely detail-focused',
      'Good balance of details and big picture',
      'Big picture thinker',
      'Depends on the task',
      'Details matter most in my area of expertise',
    ],
  },
  {
    id: 'goals',
    question: 'What are your main goals or aspirations?',
    type: 'textarea',
    placeholder: 'Describe what you want to achieve, learn, or accomplish...',
  },
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Partial<QuestionnaireResponse>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const questionInputId = `question-${question.id}`

  const handleTextInput = (value: string) => {
    setResponses({ ...responses, [question.id]: value })
  }

  const handleSelectInput = (value: string) => {
    setResponses({ ...responses, [question.id]: value })
  }

  const handleMultiSelectInput = (value: string) => {
    const current = (responses[question.id] as string[]) || []
    if (current.includes(value)) {
      setResponses({
        ...responses,
        [question.id]: current.filter(v => v !== value),
      })
    } else {
      setResponses({
        ...responses,
        [question.id]: [...current, value],
      })
    }
  }

  const canProceed = () => {
    const response = responses[question.id]
    if (!response) return false
    if (Array.isArray(response)) return response.length > 0
    return response.toString().trim().length > 0
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsGenerating(true)
      try {
        const profile = await generateProfileFromQuestionnaire(responses as QuestionnaireResponse)
        localStorage.setItem('agentProfile', JSON.stringify(profile))
        router.push('/profile')
      } catch (error) {
        console.error('Error generating profile:', error)
        setIsGenerating(false)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (isGenerating) {
    return (
      <main className="min-h-screen bg-app text-app flex items-center justify-center px-4">
        <div className="frame p-8 text-center">
          <p className="micro text-muted">Generating</p>
          <h2 className="mt-3 text-xl font-semibold">Creating your AI agent.</h2>
          <p className="mt-3 text-sm text-muted-strong">Analyzing your responses...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-app text-app">
      <AppHeader
        nav={
          <>
            <Link href="/analyze" className="hidden sm:inline hover:text-accent">Upload export</Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-3 border border-app">
            <div className="h-2" style={{ width: `${progress}%`, backgroundColor: 'var(--color-text)' }} />
          </div>
        </div>

        <div className="frame p-6 md:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">{question.question}</h2>

          {question.type === 'text' && (
            <>
              <label htmlFor={questionInputId} className="sr-only">{question.question}</label>
              <input
                id={questionInputId}
                type="text"
                value={(responses[question.id] as string) || ''}
                onChange={(e) => handleTextInput(e.target.value)}
                placeholder={question.placeholder}
                className="mt-6 w-full border border-strong bg-app px-4 py-3 text-sm focus:outline-none"
              />
            </>
          )}

          {question.type === 'textarea' && (
            <>
              <label htmlFor={questionInputId} className="sr-only">{question.question}</label>
              <textarea
                id={questionInputId}
                value={(responses[question.id] as string) || ''}
                onChange={(e) => handleTextInput(e.target.value)}
                placeholder={question.placeholder}
                rows={4}
                className="mt-6 w-full border border-strong bg-app px-4 py-3 text-sm focus:outline-none"
              />
            </>
          )}

          {question.type === 'select' && (
            <div className="mt-6 space-y-3" role="radiogroup" aria-label={question.question}>
              {question.options?.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelectInput(option)}
                  role="radio"
                  aria-checked={responses[question.id] === option}
                  className={`frame w-full px-4 py-3 text-left text-sm ${responses[question.id] === option ? 'border-strong' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiselect' && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-label={question.question}>
              {question.options?.map((option) => {
                const selected = ((responses[question.id] as string[]) || []).includes(option)
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleMultiSelectInput(option)}
                    aria-pressed={selected}
                    className={`frame px-4 py-3 text-left text-sm ${selected ? 'border-strong' : ''}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`btn-secondary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto ${currentQuestion === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`btn-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {currentQuestion === questions.length - 1 ? 'Generate Agent' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        </div>
      </div>
    </main>
  )
}
