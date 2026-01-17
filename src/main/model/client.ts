import OpenAI from 'openai';
import { AIProvider } from '../../shared/types/aiprovider';

export function createAIClient(provider: AIProvider, apiKey: string): OpenAI {

  switch (provider) {
    case 'lmstudio':
      console.log('Creating LMStudio client with API key:', apiKey);
      return new OpenAI({
        baseURL: 'http://127.0.0.1:1234/v1',
        dangerouslyAllowBrowser: true,
        apiKey: apiKey,
      });

    case 'llma3':
      return new OpenAI({
        apiKey: apiKey,
        baseURL: process.env.VITE_LLMA3_API_KEY,
        dangerouslyAllowBrowser: true,
      });
    case 'openai':
      return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

    case 'deepseek':
      return new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.deepseek.com/v1',
        dangerouslyAllowBrowser: true,
      });

    case 'gemini':
      return new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    case 'claude':
      return new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    case 'grok':
      return new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
        dangerouslyAllowBrowser: true,
      });

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
