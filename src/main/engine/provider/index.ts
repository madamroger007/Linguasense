import { AIProvider, AIRequest } from '../../../shared/types/aiprovider';
import { createAIClient } from './client';
import { speakingPrompt } from '../../../shared/model/prompts/speaking';

export async function speakWithAI(
  payload: {
    provider: AIProvider;
    request: AIRequest;
  }
) {
  try {
    const client = await createAIClient(payload.request.apiKey, payload.request.url);

    const completion = await client.chat.completions.create({
      model: payload.request.model,
      messages: [
        { role: 'system', content: speakingPrompt(payload.request.language) },
        { role: 'user', content: payload.request.message },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content ?? '';
  } catch (error) {
    console.error('Error in speakWithAI:', error);
    throw error;
  }
}
