import { createAIClient } from '../client';
import { speakingPrompt } from '../../../shared/model/prompts/speaking';
import { AIRequest } from '../../../shared/types/aiprovider';

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
