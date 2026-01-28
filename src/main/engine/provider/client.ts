import OpenAI from 'openai';
export function createAIClient(apiKey: string, url: string): OpenAI {
  try {
    return new OpenAI({
      baseURL: url,
      dangerouslyAllowBrowser: true,
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Error creating AI client:', error);
    throw error;
  }
}
