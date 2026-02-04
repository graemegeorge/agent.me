import { QuestionnaireResponse, AgentProfile } from '@/types'

export async function generateProfileFromQuestionnaire(
  responses: QuestionnaireResponse
): Promise<AgentProfile> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Map communication preference to style
  const communicationStyleMap: Record<string, AgentProfile['personality']['communicationStyle']> = {
    'Concise and to-the-point': 'formal',
    'Detailed and thorough': 'formal',
    'Casual and friendly': 'casual',
    'Formal and professional': 'formal',
    'Technical and precise': 'technical',
  }

  // Map problem solving style
  const problemSolvingMap: Record<string, AgentProfile['workStyle']['problemSolvingApproach']> = {
    'Break it down into systematic steps': 'systematic',
    'Brainstorm creative alternatives': 'creative',
    'Research and gather information first': 'systematic',
    'Discuss with others for input': 'collaborative',
    'Trust my intuition and dive in': 'independent',
  }

  // Map learning preference
  const learningStyleMap: Record<string, AgentProfile['workStyle']['learningStyle']> = {
    'Hands-on experimentation': 'hands-on',
    'Reading documentation': 'theoretical',
    'Watching tutorials': 'visual',
    'Learning from peers': 'hands-on',
    'Structured courses': 'theoretical',
  }

  // Map decision making
  const decisionMakingMap: Record<string, AgentProfile['personality']['decisionMaking']> = {
    'Data-driven analysis': 'analytical',
    'Gut feeling and experience': 'intuitive',
    'Seek advice from experts': 'balanced',
    'Weigh pros and cons carefully': 'analytical',
    'Quick decisions, adjust as needed': 'intuitive',
  }

  // Determine verbosity from communication preference
  const verbosity: AgentProfile['personality']['verbosity'] =
    responses.communicationPreference === 'Concise and to-the-point' ? 'concise' :
    responses.communicationPreference === 'Detailed and thorough' ? 'detailed' : 'moderate'

  // Determine tone
  const tone: AgentProfile['personality']['tone'] =
    responses.communicationPreference === 'Casual and friendly' ? 'warm' :
    responses.communicationPreference === 'Formal and professional' ? 'professional' : 'neutral'

  // Generate topics from role and tasks
  const topics = [responses.workRole, ...responses.primaryTasks].filter(Boolean)

  const profile: Omit<AgentProfile, 'systemPrompt'> = {
    id: crypto.randomUUID(),
    name: 'My AI Agent',
    createdAt: new Date(),

    personality: {
      communicationStyle: communicationStyleMap[responses.communicationPreference] || 'mixed',
      verbosity,
      tone,
      decisionMaking: decisionMakingMap[responses.decisionMaking] || 'balanced',
    },

    workStyle: {
      preferredTools: responses.toolsUsed || [],
      commonTopics: topics,
      expertise: [responses.workRole],
      problemSolvingApproach: problemSolvingMap[responses.problemSolvingStyle] || 'systematic',
      learningStyle: learningStyleMap[responses.learningPreference] || 'mixed',
    },

    communication: {
      averageMessageLength: verbosity === 'concise' ? 'short' : verbosity === 'detailed' ? 'long' : 'medium',
      usesEmojis: responses.communicationPreference === 'Casual and friendly',
      usesCodeExamples: responses.toolsUsed?.some(t =>
        ['JavaScript/TypeScript', 'Python', 'React/Vue/Angular', 'SQL/Databases'].includes(t)
      ) || false,
      asksClarifyingQuestions: responses.problemSolvingStyle === 'Research and gather information first',
      providesContext: verbosity === 'detailed',
    },

    interests: {
      primaryTopics: topics,
      frequentQuestions: [],
      goalsAndMotivations: responses.goals ? [responses.goals] : [],
    },

    analysis: {
      totalConversations: 0,
      totalMessages: 0,
      topKeywords: [...responses.toolsUsed || [], responses.workRole].filter(Boolean),
      sentimentOverall: 'neutral',
      questionPatterns: [],
    },
  }

  return {
    ...profile,
    systemPrompt: generateSystemPrompt(profile, responses),
  }
}

function generateSystemPrompt(
  profile: Omit<AgentProfile, 'systemPrompt'>,
  responses: QuestionnaireResponse
): string {
  const { personality, workStyle, communication } = profile

  const styleDescriptions: Record<string, string> = {
    formal: 'professional and structured',
    casual: 'friendly and approachable',
    technical: 'precise and technical',
    friendly: 'warm and conversational',
    mixed: 'adaptable to the situation',
  }

  const verbosityDescriptions: Record<string, string> = {
    concise: 'Keep responses brief and to the point.',
    moderate: 'Provide balanced responses with enough detail to be helpful.',
    detailed: 'Give comprehensive responses with thorough explanations.',
  }

  const prompt = `You are an AI assistant modeled after a ${responses.workRole}. Here's how you should behave:

## About You
- Role: ${responses.workRole}
- Main focus areas: ${responses.primaryTasks.join(', ')}
- Tools & technologies: ${responses.toolsUsed.join(', ')}

## Communication Style
- Your tone is ${styleDescriptions[personality.communicationStyle]}
- ${verbosityDescriptions[personality.verbosity]}
${communication.usesEmojis ? '- Feel free to use emojis occasionally to add personality' : '- Keep responses professional without emojis'}
${communication.usesCodeExamples ? '- Include code examples when relevant to technical discussions' : ''}

## Problem-Solving Approach
- ${responses.problemSolvingStyle}
- You are ${workStyle.problemSolvingApproach} in your approach

## Work Style
- Team preference: ${responses.teamCollaboration}
- Learning style: ${responses.learningPreference}
- Under pressure: ${responses.stressHandling}
- Creativity: ${responses.creativity}
- Detail orientation: ${responses.detailOrientation}

## Decision Making
- ${responses.decisionMaking}
- You tend to be ${personality.decisionMaking} in your decisions

## Goals & Motivations
${responses.goals || 'Excellence in your field'}

## Response Guidelines
1. Match the user's level of formality
2. Draw from your expertise as a ${responses.workRole}
3. ${personality.decisionMaking === 'analytical' ? 'Support recommendations with logic and data' : personality.decisionMaking === 'intuitive' ? 'Trust your instincts while being helpful' : 'Balance intuition with analysis'}
4. Be helpful, accurate, and true to this personality profile

Remember: You're not just any AI - you're an AI that thinks and communicates like this specific person.`

  return prompt
}
