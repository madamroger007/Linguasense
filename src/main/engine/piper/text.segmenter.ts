export function segmentText(text: string): string[] {
  return text
    .split(/(?<=[.!?,])/)
    .flatMap(s =>
      s.trim().split(/\s+(?=[A-Za-z_]+\.[A-Za-z]+)/)
    )
    .map(s => s.trim())
    .filter(Boolean);
}
