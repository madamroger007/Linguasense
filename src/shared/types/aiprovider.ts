export type AIProvider =
  | 'lmstudio'
  | 'openai'
  | 'llma3'
  | 'claude'
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
