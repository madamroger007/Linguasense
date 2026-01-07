import { createAIClient } from '../client';
import { speakingPrompt } from '../prompts/speaking';
import { AIRequest } from '../types';

export async function speakWithDeepSeek(request: AIRequest) {
  const client = createAIClient('deepseek');

  const completion = await client.chat.completions.create({
    model: request.model, // contoh: deepseek-chat
    messages: [
      { role: 'system', content: speakingPrompt(request.language) },
      { role: 'user', content: request.message },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content ?? '';
}
