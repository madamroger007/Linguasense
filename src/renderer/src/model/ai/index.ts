import { AIProvider, AIRequest } from './types';
import { speakWithOpenAI } from './providers/openai';
import { speakWithLMStudio } from './providers/lmstudio';
import { speakWithGemini } from './providers/gemini';
import { speakWithDeepSeek } from './providers/deepseek';

export async function speakWithAI(
  provider: AIProvider,
  request: AIRequest
): Promise<string> {
  switch (provider) {
    case 'openai':
      return speakWithOpenAI(request);

    case 'lmstudio':
      return speakWithLMStudio(request);

    case 'gemini':
      return speakWithGemini(request);

    case 'deepseek':
      return speakWithDeepSeek(request);

    default:
      throw new Error('Unsupported AI provider');
  }
}
