export function buildArticlePrompt(level: string, language: string) {
  return `
Create a short reading article for language learners.

Level: ${level}
Language: ${language}

Rules:
- 2–3 short paragraphs
- Clear and simple sentences
- Suitable for the specified level
- No title, only the article text
`;
}
