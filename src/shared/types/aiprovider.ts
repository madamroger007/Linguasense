export type AIProvider =
  | 'openai'
  | 'lmstudio'
  | 'llma3'
  | 'claude'
  | 'grok'
  | 'gemini'
  | 'deepseek';

export interface AIRequest {
  message: string;
  language: string;
  model: string;
  apiKey: string;
}

export interface AIResponse {
  content: string;
}
