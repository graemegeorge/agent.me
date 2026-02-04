import { ChatGPTConversation, AgentProfile } from '@/types'

interface ConversationData {
  conversations: ChatGPTConversation[]
}

interface MessageStats {
  totalMessages: number
  userMessages: string[]
  averageLength: number
  usesEmojis: boolean
  usesCodeBlocks: boolean
  questionCount: number
}

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
  'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
  'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been',
  'being', 'has', 'had', 'does', 'did', 'doing', 'should', 'am', 'im', 'dont',
  'cant', 'wont', 'isnt', 'arent', 'wasnt', 'werent', 'hasnt', 'havent', 'hadnt',
  'doesnt', 'didnt', 'shouldnt', 'wouldnt', 'couldnt', 'please', 'thanks', 'thank',
  'help', 'need', 'using', 'trying', 'try', 'getting', 'something', 'thing', 'things'
])

// Topic categories for classification
const TOPIC_CATEGORIES: Record<string, string[]> = {
  'Programming & Development': ['code', 'programming', 'javascript', 'python', 'react', 'api', 'function', 'class', 'database', 'sql', 'html', 'css', 'typescript', 'nodejs', 'backend', 'frontend', 'software', 'developer', 'debug', 'error', 'bug', 'git', 'github'],
  'Data & Analytics': ['data', 'analysis', 'analytics', 'machine learning', 'ai', 'model', 'dataset', 'statistics', 'visualization', 'pandas', 'numpy', 'tensorflow', 'pytorch'],
  'Writing & Content': ['write', 'writing', 'content', 'article', 'blog', 'email', 'copy', 'story', 'creative', 'edit', 'grammar', 'tone'],
  'Business & Strategy': ['business', 'strategy', 'marketing', 'sales', 'customer', 'product', 'market', 'growth', 'revenue', 'startup', 'entrepreneur'],
  'Design & Creative': ['design', 'ui', 'ux', 'interface', 'visual', 'color', 'layout', 'figma', 'prototype', 'user experience'],
  'Research & Learning': ['research', 'learn', 'study', 'explain', 'understand', 'concept', 'theory', 'education', 'course'],
  'Productivity & Tools': ['productivity', 'workflow', 'automation', 'tool', 'app', 'organize', 'manage', 'efficiency', 'task'],
}

function extractUserMessages(conversations: ChatGPTConversation[]): string[] {
  const messages: string[] = []

  for (const conv of conversations) {
    if (!conv.mapping) continue

    for (const node of Object.values(conv.mapping)) {
      if (
        node.message?.author?.role === 'user' &&
        node.message?.content?.parts
      ) {
        const content = node.message.content.parts.join(' ').trim()
        if (content && content.length > 0) {
          messages.push(content)
        }
      }
    }
  }

  return messages
}

function analyzeMessages(messages: string[]): MessageStats {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
  const codeBlockRegex = /```[\s\S]*?```|`[^`]+`/g
  const questionRegex = /\?/g

  let totalLength = 0
  let emojiCount = 0
  let codeCount = 0
  let questionCount = 0

  for (const msg of messages) {
    totalLength += msg.length
    if (emojiRegex.test(msg)) emojiCount++
    if (codeBlockRegex.test(msg)) codeCount++
    questionCount += (msg.match(questionRegex) || []).length
  }

  return {
    totalMessages: messages.length,
    userMessages: messages,
    averageLength: messages.length > 0 ? totalLength / messages.length : 0,
    usesEmojis: emojiCount / messages.length > 0.1,
    usesCodeBlocks: codeCount / messages.length > 0.05,
    questionCount,
  }
}

function extractKeywords(messages: string[]): string[] {
  const wordCounts: Record<string, number> = {}

  for (const msg of messages) {
    const words = msg.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !STOP_WORDS.has(word))

    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    }
  }

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word)
}

function identifyTopics(keywords: string[]): string[] {
  const topicScores: Record<string, number> = {}

  for (const [topic, topicKeywords] of Object.entries(TOPIC_CATEGORIES)) {
    let score = 0
    for (const keyword of keywords) {
      if (topicKeywords.some(tk => keyword.includes(tk) || tk.includes(keyword))) {
        score++
      }
    }
    if (score > 0) {
      topicScores[topic] = score
    }
  }

  return Object.entries(topicScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic)
}

function extractQuestionPatterns(messages: string[]): string[] {
  const patterns: string[] = []
  const questionStarters = ['how', 'what', 'why', 'can', 'could', 'should', 'is', 'are', 'do', 'does', 'will', 'would']

  const questionMessages = messages.filter(m => m.includes('?'))

  for (const msg of questionMessages.slice(0, 100)) {
    const firstWord = msg.toLowerCase().split(/\s+/)[0]
    if (questionStarters.includes(firstWord) && !patterns.includes(firstWord)) {
      patterns.push(firstWord)
    }
  }

  return patterns.slice(0, 5)
}

function determineCommunicationStyle(stats: MessageStats, keywords: string[]): AgentProfile['personality']['communicationStyle'] {
  const avgLength = stats.averageLength

  // Check for technical keywords
  const technicalKeywords = ['code', 'function', 'api', 'error', 'debug', 'implementation', 'algorithm']
  const technicalCount = keywords.filter(k => technicalKeywords.some(tk => k.includes(tk))).length

  if (technicalCount > 3) return 'technical'
  if (stats.usesEmojis && avgLength < 100) return 'casual'
  if (avgLength > 200) return 'formal'
  if (stats.questionCount / stats.totalMessages > 0.8) return 'friendly'
  return 'mixed'
}

function determineVerbosity(avgLength: number): AgentProfile['personality']['verbosity'] {
  if (avgLength < 80) return 'concise'
  if (avgLength > 200) return 'detailed'
  return 'moderate'
}

function determineProblemSolvingApproach(messages: string[], keywords: string[]): AgentProfile['workStyle']['problemSolvingApproach'] {
  const systematicWords = ['step', 'first', 'then', 'next', 'process', 'method', 'approach', 'analyze']
  const creativeWords = ['idea', 'creative', 'different', 'alternative', 'unique', 'innovative']
  const collaborativeWords = ['team', 'together', 'collaborate', 'discuss', 'feedback', 'review']

  const text = messages.join(' ').toLowerCase()

  const systematicScore = systematicWords.filter(w => text.includes(w)).length
  const creativeScore = creativeWords.filter(w => text.includes(w)).length
  const collaborativeScore = collaborativeWords.filter(w => text.includes(w)).length

  const max = Math.max(systematicScore, creativeScore, collaborativeScore)

  if (max === systematicScore) return 'systematic'
  if (max === creativeScore) return 'creative'
  if (max === collaborativeScore) return 'collaborative'
  return 'independent'
}

function generateSystemPrompt(profile: Omit<AgentProfile, 'systemPrompt'>): string {
  const { personality, workStyle, communication, interests } = profile

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

  const prompt = `You are an AI assistant modeled after a specific person's communication style and expertise. Here's how you should behave:

## Communication Style
- Your tone is ${styleDescriptions[personality.communicationStyle]}
- ${verbosityDescriptions[personality.verbosity]}
${communication.usesEmojis ? '- Feel free to use emojis occasionally to add personality' : '- Keep responses professional without emojis'}
${communication.usesCodeExamples ? '- Include code examples when relevant to technical discussions' : ''}
${communication.asksClarifyingQuestions ? '- Ask clarifying questions when the request is ambiguous' : '- Make reasonable assumptions rather than asking too many questions'}

## Areas of Expertise
${interests.primaryTopics.map(topic => `- ${topic}`).join('\n')}

## Problem-Solving Approach
- You tend to be ${workStyle.problemSolvingApproach} in your approach to solving problems
- When faced with challenges, you ${workStyle.problemSolvingApproach === 'systematic' ? 'break them down into steps' : workStyle.problemSolvingApproach === 'creative' ? 'look for innovative solutions' : workStyle.problemSolvingApproach === 'collaborative' ? 'seek input and feedback' : 'work through them independently'}

## Response Guidelines
1. Match the user's level of formality
2. Draw from your expertise in: ${interests.primaryTopics.slice(0, 3).join(', ')}
3. ${personality.decisionMaking === 'analytical' ? 'Support recommendations with logic and data' : personality.decisionMaking === 'intuitive' ? 'Trust your instincts while being helpful' : 'Balance intuition with analysis'}
4. Be helpful, accurate, and true to this personality profile

Remember: You're not just any AI - you're an AI that thinks and communicates like this specific person.`

  return prompt
}

export async function analyzeChatHistory(data: ConversationData): Promise<AgentProfile> {
  const messages = extractUserMessages(data.conversations)

  if (messages.length === 0) {
    throw new Error('No user messages found in the export')
  }

  const stats = analyzeMessages(messages)
  const keywords = extractKeywords(messages)
  const topics = identifyTopics(keywords)
  const questionPatterns = extractQuestionPatterns(messages)

  const profile: Omit<AgentProfile, 'systemPrompt'> = {
    id: crypto.randomUUID(),
    name: 'My AI Agent',
    createdAt: new Date(),

    personality: {
      communicationStyle: determineCommunicationStyle(stats, keywords),
      verbosity: determineVerbosity(stats.averageLength),
      tone: stats.usesEmojis ? 'warm' : 'professional',
      decisionMaking: stats.questionCount / stats.totalMessages > 0.5 ? 'analytical' : 'balanced',
    },

    workStyle: {
      preferredTools: keywords.filter(k =>
        ['react', 'python', 'javascript', 'typescript', 'nodejs', 'sql', 'git', 'docker', 'aws', 'figma', 'notion'].includes(k)
      ).slice(0, 5),
      commonTopics: topics,
      expertise: topics.slice(0, 3),
      problemSolvingApproach: determineProblemSolvingApproach(messages, keywords),
      learningStyle: stats.questionCount / stats.totalMessages > 0.6 ? 'hands-on' : 'mixed',
    },

    communication: {
      averageMessageLength: stats.averageLength < 80 ? 'short' : stats.averageLength > 200 ? 'long' : 'medium',
      usesEmojis: stats.usesEmojis,
      usesCodeExamples: stats.usesCodeBlocks,
      asksClarifyingQuestions: questionPatterns.includes('can') || questionPatterns.includes('could'),
      providesContext: stats.averageLength > 150,
    },

    interests: {
      primaryTopics: topics,
      frequentQuestions: questionPatterns.map(p => `${p.charAt(0).toUpperCase() + p.slice(1)}-type questions`),
      goalsAndMotivations: topics.map(t => `Excellence in ${t}`),
    },

    analysis: {
      totalConversations: data.conversations.length,
      totalMessages: stats.totalMessages,
      topKeywords: keywords.slice(0, 20),
      sentimentOverall: 'neutral',
      questionPatterns,
    },
  }

  return {
    ...profile,
    systemPrompt: generateSystemPrompt(profile),
  }
}
