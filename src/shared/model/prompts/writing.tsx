export function buildWritingDescriptionPrompt(
  fromLanguage: string,
  toLanguage: string
): string {
  return `
You are a language learning assistant.

TASK:
Create a short writing practice text.

SOURCE LANGUAGE: ${fromLanguage}
TARGET LANGUAGE: ${toLanguage}

RULES:
- Write ONLY in the SOURCE LANGUAGE
- Length: 2–3 short paragraphs
- Topic must be random and everyday (daily life, travel, culture, work, hobbies)
- Use clear, natural sentences
- Avoid slang unless common and simple
- Do NOT include title
- Do NOT include translation
- Output ONLY the text

PURPOSE:
The learner will translate this text into the target language manually.
`;
}


export function buildWritingFeedbackPrompt(
  sourceText: string,
  userWriting: string,
  fromLanguage: string,
  toLanguage: string
): string {
  return `
You are a professional language writing evaluator.

TASK:
Evaluate the learner's translation.

SOURCE LANGUAGE: ${fromLanguage}
TARGET LANGUAGE: ${toLanguage}

ORIGINAL TEXT (SOURCE):
"""
${sourceText}
"""

LEARNER'S TRANSLATION (TARGET):
"""
${userWriting}
"""

EVALUATION CRITERIA:
- Accuracy of meaning
- Grammar correctness
- Sentence structure
- Naturalness for native speakers

SCORING:
- Score from 0 to 100

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "suggestions": [
    "string",
    "string",
    "string"
  ],
  "score": number,
  "summary": "short overall feedback"
}

IMPORTANT:
- Do NOT explain outside JSON
- Do NOT include markdown
- Do NOT add extra fields
`;
}
