export function TranslatePrompt(text: string, targetLanguage: string): string {
  return `Translate the following text to ${targetLanguage}:

"${text}"

Provide only the translated text, without any additional explanation or commentary.`;
}
