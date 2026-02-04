import { AgentProfile } from '@/types'

interface AuthCaptureInput {
  provider?: string | null
  name?: string | null
  email?: string | null
}

function titleCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function inferCommonTopics(provider: string | null): string[] {
  if (provider === 'github') {
    return ['Programming & Development', 'Open Source', 'Technical Collaboration']
  }
  if (provider === 'google') {
    return ['Productivity & Tools', 'Research & Learning', 'Collaboration']
  }
  return ['Problem Solving', 'Research & Learning', 'Productivity & Tools']
}

function inferTools(provider: string | null): string[] {
  if (provider === 'github') return ['Git', 'GitHub', 'Code Reviews', 'Pull Requests']
  if (provider === 'google') return ['Google Workspace', 'Docs', 'Drive', 'Calendar']
  return ['Digital Tools', 'AI Assistants']
}

function generateSystemPrompt(profile: Omit<AgentProfile, 'systemPrompt'>, providerLabel: string): string {
  return `You are an AI assistant modeled from a connected ${providerLabel} account profile.

## Identity Baseline
- Name: ${profile.name}
- Core topics: ${profile.interests.primaryTopics.join(', ')}
- Preferred tools: ${profile.workStyle.preferredTools.join(', ')}

## Communication Style
- Tone: warm and professional
- Verbosity: moderate detail by default
- Clarity-first writing with practical examples when useful

## Working Style
- Problem-solving approach: systematic
- Decision style: analytical but pragmatic
- Collaboration style: supportive and action-oriented

## Response Guidelines
1. Be concise first, then expand when asked.
2. Suggest concrete next steps and actionable plans.
3. Keep language human, clear, and collaborative.
4. Adapt depth to the user's technical level.

You should feel like a helpful digital twin that reflects this profile with consistency.`
}

export function generateProfileFromAuthData(input: AuthCaptureInput): AgentProfile {
  const provider = input.provider ?? 'connected account'
  const providerLabel = titleCase(provider)
  const displayName = input.name?.trim() || (input.email ? input.email.split('@')[0] : '') || 'Connected User'
  const topics = inferCommonTopics(input.provider ?? null)
  const tools = inferTools(input.provider ?? null)

  const profile: Omit<AgentProfile, 'systemPrompt'> = {
    id: crypto.randomUUID(),
    name: `${displayName}'s AI Agent`,
    createdAt: new Date(),
    personality: {
      communicationStyle: 'friendly',
      verbosity: 'moderate',
      tone: 'warm',
      decisionMaking: 'analytical',
    },
    workStyle: {
      preferredTools: tools,
      commonTopics: topics,
      expertise: topics.slice(0, 2),
      problemSolvingApproach: 'systematic',
      learningStyle: 'hands-on',
    },
    communication: {
      averageMessageLength: 'medium',
      usesEmojis: false,
      usesCodeExamples: input.provider === 'github',
      asksClarifyingQuestions: true,
      providesContext: true,
    },
    interests: {
      primaryTopics: topics,
      frequentQuestions: ['How can I improve this workflow?', 'What should I do next?'],
      goalsAndMotivations: [
        `Build an AI assistant that reflects ${displayName}'s style`,
        `Use ${providerLabel} data to improve personalization`,
      ],
    },
    analysis: {
      totalConversations: 0,
      totalMessages: 0,
      topKeywords: [providerLabel, ...tools, ...topics].slice(0, 20),
      sentimentOverall: 'neutral',
      questionPatterns: ['how', 'what', 'can'],
    },
  }

  return {
    ...profile,
    systemPrompt: generateSystemPrompt(profile, providerLabel),
  }
}
