import { spawnSync } from 'child_process';
import path from 'path';

/* ================================
 * TYPES
 * ================================ */
export type LangCode =
  | 'ar_JO'
  | 'zh_CN'
  | 'id_ID'
  | 'en_US'
  | 'en_GB'
  | 'de_DE'
  | 'fr_FR'
  | 'es_ES'
  | 'it_IT'
  | 'pt_BR'
  | 'pt_PT';

/* ================================
 * FASTTEXT PATHS
 * ================================ */
const FASTTEXT_BIN = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'piper',
  'fastText',
  'fasttext'
);

const FASTTEXT_MODEL = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'piper',
  'lang',
  'lid.176.bin'
);

/* ================================
 * 1. SCRIPT LEVEL (ABSOLUTE)
 * ================================ */
function detectByScript(text: string): LangCode | null {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar_JO';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh_CN';
  return null;
}

/* ================================
 * 2. STRONG GRAMMAR MARKERS
 * ================================ */
const GRAMMAR = {
  id_ID: [
    'silakan', 'coba', 'lagi', 'yang', 'dan',
    'tidak', 'sudah', 'bisa', 'akan', 'ini',
    'itu', 'ke', 'dari', 'pada', 'nanti', 'ya'
  ],
  en: [
    'the', 'this', 'that', 'you', 'your',
    'please', 'again', 'try', 'can', 'will',
    'thanks', 'thank', 'tanks'
  ],
  de_DE: ['der', 'die', 'das', 'und', 'nicht', 'ist'],
  fr_FR: ['le', 'la', 'les', 'est', 'que', 'une'],
  es_ES: ['el', 'la', 'los', 'las', 'para', 'una'],
  it_IT: ['il', 'lo', 'la', 'gli', 'che', 'una'],
  pt: ['não', 'para', 'uma', 'que', 'com', 'está'],
};

function grammarScore(text: string, words: string[]): number {
  let score = 0;
  for (const w of words) {
    const re = new RegExp(`\\b${w}\\b`, 'gi');
    const m = text.match(re);
    if (m) score += m.length * 2;
  }
  return score;
}

/* ================================
 * 3. FASTTEXT (SUPPORTING ONLY)
 * ================================ */
function fastTextDetect(
  text: string
): { label: string; prob: number } | null {
  const res = spawnSync(
    FASTTEXT_BIN,
    ['predict-prob', FASTTEXT_MODEL, '-', '1'],
    {
      input: text,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }
  );

  if (res.status !== 0 || !res.stdout) return null;

  const [rawLabel, rawProb] = res.stdout.trim().split(/\s+/);
  return {
    label: rawLabel.replace('__label__', ''),
    prob: parseFloat(rawProb),
  };
}

/* ================================
 * 4. MAIN DETECTOR
 * ================================ */
export function detectLang(text: string): LangCode {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'en_US';

  // (1) Script
  const script = detectByScript(cleaned);
  if (script) return script;

  const lower = cleaned.toLowerCase();

  // (2) Grammar scoring
  const scores = {
    id_ID: grammarScore(lower, GRAMMAR.id_ID),
    en: grammarScore(lower, GRAMMAR.en),
    de_DE: grammarScore(lower, GRAMMAR.de_DE),
    fr_FR: grammarScore(lower, GRAMMAR.fr_FR),
    es_ES: grammarScore(lower, GRAMMAR.es_ES),
    it_IT: grammarScore(lower, GRAMMAR.it_IT),
    pt: grammarScore(lower, GRAMMAR.pt),
  };

  const [bestLang, bestScore] =
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  if (bestScore >= 4) {
    if (bestLang === 'en') {
      return /colour|centre|programme/i.test(lower)
        ? 'en_GB'
        : 'en_US';
    }

    if (bestLang === 'pt') {
      return /você|brasil|cara/i.test(lower)
        ? 'pt_BR'
        : 'pt_PT';
    }

    return bestLang as LangCode;
  }

  // (3) fastText fallback
  const ft = fastTextDetect(cleaned);
  if (ft && ft.prob >= 0.75) {
    if (ft.label === 'id') return 'id_ID';
    if (ft.label === 'en') return 'en_US';
    if (ft.label === 'fr') return 'fr_FR';
    if (ft.label === 'de') return 'de_DE';
    if (ft.label === 'es') return 'es_ES';
    if (ft.label === 'it') return 'it_IT';
    if (ft.label === 'pt') {
      return /você|brasil|cara/i.test(lower)
        ? 'pt_BR'
        : 'pt_PT';
    }
  }

  return 'en_US';
}
