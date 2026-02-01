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
  requiresUrl: boolean;
  url?: string;
  docs?: string;
  models: AIModelOption[];
}> = {
  // =====================
  // LOCAL / FREE
  // =====================
  lmstudio: {
    label: 'LM Studio (Local · Free)',
    requiresApiKey: false,
    free: true,
    requiresUrl: true,
    url: "https://lmstudio.ai/",
    docs: "https://lmstudio.ai/docs",
    models: [
      { id: 'openai/gpt-oss-20b', label: 'OpenAI 20B', free: true },
      { id: 'deepseek/deepseek-r1-0528-qwen3-8b', label: 'DeepSeek 8B', free: true },
      { id: 'qwen2.5-7b-instruct', label: 'Qwen 2.5 7B Instruct', free: true },
    ],
  },

  llma3: {
    label: 'Ollama (Local · Free)',
    requiresApiKey: false,
    free: true,
    requiresUrl: true,
    docs: "https://ollama.com/docs",
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
    requiresUrl: true,
    docs: "https://platform.openai.com/docs",
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Paid)', free: false },
    ],
  },

  deepseek: {
    label: 'DeepSeek (Limited Free)',
    requiresApiKey: true,
    free: false,
    requiresUrl: true,
    docs: "https://deepseek.com/docs",
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat (Trial)', free: false },
    ],
  },
  claude: {
    label: 'Claude (Paid)',
    requiresApiKey: true,
    free: false,
    requiresUrl: true,
    docs: "https://claude.ai/docs",
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
    requiresUrl: true,
    docs: "https://developers.generativeai.google/docs/gemini/getting-started",
    models: [
      { id: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview', free: true },
    ],
  },
};
