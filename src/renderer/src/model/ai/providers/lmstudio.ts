import { createAIClient } from '../client';
import { speakingPrompt } from '../prompts/speaking';
import { AIRequest } from '../types';

export async function speakWithLMStudio(request: AIRequest) {
  const client = createAIClient('lmstudio');

  const completion = await client.chat.completions.create({
    model: request.model,
    messages: [
      { role: 'system', content: speakingPrompt(request.language) },
      { role: 'user', content: request.message },
    ],
    temperature: 0.7,
    max_tokens: 512,
  });

  return completion.choices[0].message.content ?? '';
}
