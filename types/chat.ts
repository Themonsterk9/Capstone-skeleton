export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'thinking' | 'streaming' | 'completed' | 'stopped' | 'error';

export interface ChatMessageMetadata {
  model?: string;
  tokens?: number;
  finishReason?: string;
  error?: string;
  executionTimeMs?: number;
  stoppedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO format or localized time string
  status?: MessageStatus;
  metadata?: ChatMessageMetadata;
}

export interface AIModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
}

export interface ChatOptions {
  apiEndpoint?: string;
  storageKey?: string;
  initialMessages?: ChatMessage[];
  onFinish?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}
