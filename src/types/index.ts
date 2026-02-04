export interface AgentProfile {
  id: string;
  name: string;
  createdAt: Date;

  // Personality traits
  personality: {
    communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly' | 'mixed';
    verbosity: 'concise' | 'moderate' | 'detailed';
    tone: 'professional' | 'warm' | 'neutral' | 'enthusiastic';
    decisionMaking: 'analytical' | 'intuitive' | 'balanced';
  };

  // Work patterns
  workStyle: {
    preferredTools: string[];
    commonTopics: string[];
    expertise: string[];
    problemSolvingApproach: 'systematic' | 'creative' | 'collaborative' | 'independent';
    learningStyle: 'hands-on' | 'theoretical' | 'visual' | 'mixed';
  };

  // Communication patterns
  communication: {
    averageMessageLength: 'short' | 'medium' | 'long';
    usesEmojis: boolean;
    usesCodeExamples: boolean;
    asksClarifyingQuestions: boolean;
    providesContext: boolean;
  };

  // Interests and focus areas
  interests: {
    primaryTopics: string[];
    frequentQuestions: string[];
    goalsAndMotivations: string[];
  };

  // Raw analysis data
  analysis: {
    totalConversations: number;
    totalMessages: number;
    topKeywords: string[];
    sentimentOverall: 'positive' | 'neutral' | 'negative';
    questionPatterns: string[];
  };

  // Generated system prompt for the agent
  systemPrompt: string;
}

export interface ChatGPTExport {
  conversations: ChatGPTConversation[];
}

export interface ChatGPTConversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ChatGPTMessage>;
}

export interface ChatGPTMessage {
  id: string;
  message?: {
    id: string;
    author: {
      role: 'user' | 'assistant' | 'system';
    };
    content: {
      content_type: string;
      parts?: string[];
    };
    create_time?: number;
  };
  parent?: string;
  children?: string[];
}

export interface QuestionnaireResponse {
  workRole: string;
  primaryTasks: string[];
  communicationPreference: string;
  problemSolvingStyle: string;
  toolsUsed: string[];
  learningPreference: string;
  teamCollaboration: string;
  decisionMaking: string;
  stressHandling: string;
  creativity: string;
  detailOrientation: string;
  goals: string;
}

export interface AnalysisProgress {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'generating' | 'complete';
  progress: number;
  message: string;
}
