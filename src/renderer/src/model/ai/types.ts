export type AIProvider =
  | 'openai'
  | 'lmstudio'
  | 'gemini'
  | 'deepseek';

export interface AIRequest {
  message: string;
  language: string;
  model: string;
}

export interface AIResponse {
  content: string;
}
