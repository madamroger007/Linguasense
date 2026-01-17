import { AIProvider } from '../types/aiprovider';

export type AIModelOption = {
  id: string;
  label: string;
  free: boolean;
};

export const AI_CATALOG: Record<AIProvider, {
  label: string;
  requiresApiKey: boolean;
  free: boolean;
  models: AIModelOption[];
}> = {
  // =====================
  // LOCAL / FREE
  // =====================
  lmstudio: {
    label: 'LM Studio (Local · Free)',
    requiresApiKey: false,
    free: true,
    models: [
      { id: 'deepseek/deepseek-r1-0528-qwen3-8b', label: 'DeepSeek 8B', free: true },
      { id: 'openai/gpt-oss-20b', label: 'OpenAI 20B', free: true },
      { id: 'qwen2.5-7b-instruct', label: 'Qwen 2.5 7B Instruct', free: true },
    ],
  },

  llma3: {
    label: 'Ollama (Local · Free)',
    requiresApiKey: false,
    free: true,
    models: [
      { id: 'llama3', label: 'LLaMA 3', free: true },
      { id: 'mistral', label: 'Mistral', free: true },
      { id: 'qwen2.5', label: 'Qwen 2.5', free: true },
    ],
  },

  // =====================
  // PAID / LIMITED
  // =====================
  openai: {
    label: 'OpenAI (Paid)',
    requiresApiKey: true,
    free: false,
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Paid)', free: false },
    ],
  },

  deepseek: {
    label: 'DeepSeek (Limited Free)',
    requiresApiKey: true,
    free: false,
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat (Trial)', free: false },
    ],
  },

  claude: {
    label: 'Claude (Paid)',
    requiresApiKey: true,
    free: false,
    models: [
      { id: 'claude-opus-4.5', label: 'Claude Opus 4.5', free: false },
      { id: 'claude-3-haiku', label: 'Claude 3 Haiku', free: false },
      { id: 'claude-2', label: 'Claude 2', free: false },
    ],
  },

  gemini: {
    label: 'Gemini (Limited Free)',
    requiresApiKey: true,
    free: true,
    models: [
      { id: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview', free: true },
    ],
  },
};
