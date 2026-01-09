import OpenAI from 'openai';
import { AIProvider } from '../../shared/types/aiprovider';

export function createAIClient(provider: AIProvider): OpenAI {
  switch (provider) {
    case 'lmstudio':
      return new OpenAI({
        apiKey: 'lm-studio',
        baseURL: 'http://192.168.1.2:1234/v1',
        dangerouslyAllowBrowser: true,
      });

    case 'llma3':
      return new OpenAI({
        apiKey: 'llma3',
        baseURL: process.env.VITE_LLMA3_API_KEY,
        dangerouslyAllowBrowser: true,
      });
    case 'openai':
      return new OpenAI({
        apiKey: process.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

    case 'deepseek':
      return new OpenAI({
        apiKey: process.env.VITE_DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
        dangerouslyAllowBrowser: true,
      });

    case 'gemini':
      return new OpenAI({
        apiKey: process.env.VITE_GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    case 'claude':
      return new OpenAI({
        apiKey: process.env.VITE_GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    case 'grok':
      return new OpenAI({
        apiKey: process.env.VITE_GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
