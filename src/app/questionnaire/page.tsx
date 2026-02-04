'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QuestionnaireResponse, AgentProfile } from '@/types'
import { generateProfileFromQuestionnaire } from '@/lib/questionnaire'

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
    question: 'What are your main day-to-day tasks?',
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
    question: 'What tools and technologies do you use regularly?',
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
      // Generate profile
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
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Creating Your AI Agent</h2>
          <p className="text-gray-400">Analyzing your responses...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold brand-logo">
              agent.me
            </Link>
            <Link href="/analyze" className="text-gray-400 hover:text-white transition-colors">
              Or upload ChatGPT export →
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

          {/* Text Input */}
          {question.type === 'text' && (
            <input
              type="text"
              value={(responses[question.id] as string) || ''}
              onChange={(e) => handleTextInput(e.target.value)}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          )}

          {/* Textarea */}
          {question.type === 'textarea' && (
            <textarea
              value={(responses[question.id] as string) || ''}
              onChange={(e) => handleTextInput(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          )}

          {/* Select */}
          {question.type === 'select' && (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectInput(option)}
                  className={`
                    w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${responses[question.id] === option
                      ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-primary-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }
                    border
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Multi-select */}
          {question.type === 'multiselect' && (
            <div className="grid grid-cols-2 gap-3">
              {question.options?.map((option) => {
                const selected = ((responses[question.id] as string[]) || []).includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => handleMultiSelectInput(option)}
                    className={`
                      px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${selected
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-primary-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      }
                      border text-sm
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {selected && (
                        <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${currentQuestion === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all duration-200
              ${canProceed()
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            {currentQuestion === questions.length - 1 ? 'Generate Agent' : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  )
}
