export function segmentText(text: string): string[] {
  // Pisah berdasarkan punctuation tapi jaga kata teknis
  return text
    .split(/(?<=[.!?,])/)
    .flatMap(s =>
      s.trim().split(/\s+(?=[A-Za-z_]+\.[A-Za-z]+)/)
    )
    .map(s => s.trim())
    .filter(Boolean);
}
