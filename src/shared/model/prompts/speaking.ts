export function speakingPrompt(language: string): string {
  return `
You are a professional language tutor.

The user is practicing SPEAKING in ${language}.

Rules:
- Always respond in ${language}
- Correct grammar and sentence structure gently
- Provide a natural improved sentence
- Give a short, friendly explanation
- Encourage the user to speak again
- Keep responses concise and supportive
`;
}

/**
 * Initial greeting message shown in UI
 * (NOT system prompt, just UI message)
 */
export function speakingGreeting(language: string): string {
  return `Hello! 👋

Welcome to speaking practice (${language}).

Click the microphone button and start speaking naturally.
I will help you improve step by step 😊`;
}
