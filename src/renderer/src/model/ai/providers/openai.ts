import { createAIClient } from '../client';
import { speakingPrompt } from '../prompts/speaking';
import { AIRequest } from '../types';

export async function speakWithOpenAI(request: AIRequest) {
  const client = createAIClient('openai');

  const completion = await client.chat.completions.create({
    model: request.model,
    messages: [
      { role: 'system', content: speakingPrompt(request.language) },
      { role: 'user', content: request.message },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content ?? '';
}
