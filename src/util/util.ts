import allWordsDict from '../../content/generated/dictionary/all_words.json';
import devanagari from '../../content/generated/transliteration_rulesets/devanagari.json';
import { transliterate } from './transliterator';

type WordDictEntry = [string, string[], string[], string[]];

interface AllWordsDict {
  [word: string]: WordDictEntry;
}

const typedAllWordsDict = allWordsDict as unknown as AllWordsDict;

// Cache for transliteration results to avoid repeated computation
const transliterationCache = new Map<string, string>();

function getCachedTransliteration(text: string): string {
  if (transliterationCache.has(text)) {
    return transliterationCache.get(text)!;
  }
  const result = transliterate(text, devanagari);
  transliterationCache.set(text, result);
  return result;
}

// Converts a string to a URL compatible format
export function toUrl(str: string): string {
  return str
    .replaceAll(': ', '-')
    .replaceAll(' ', '-')
    .replaceAll('.', '-')
    .replaceAll('√', 'rt')
    .replaceAll('<', 'lt')
    .replaceAll('>', 'gt')
    .replaceAll('(', 'lparen')
    .replaceAll(')', 'rparen')
    .toLowerCase();
}

// Generates the dictionary URL for a given word
export function toDictUrl(word: string): string {
  const entry = typedAllWordsDict[word];
  if (!entry) {
    return `/dictionary/unknown#${toUrl(word)}`;
  }
  return `/dictionary/${entry[0]}#${toUrl(word)}`;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

function isNumber(obj: unknown): boolean {
  return typeof obj === 'string' && !isNaN(Number(obj));
}

// Converts a string converted by `toUrl` to title case
export function titleCaseFromUrl(str: string): string {
  let titleCase: string[] = [];

  // Special case for Home
  if (str === '/') {
    return 'Home';
  }

  const strParts = str.split('-');

  // Special case for purely numerical titles, which should be joined by a '-' instead of a space.
  if (strParts.every(isNumber)) {
    return strParts.join('-');
  }

  for (const substr of strParts) {
    for (const word of substr.split('_')) {
      titleCase.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
  }
  return titleCase.join(' ');
}

export function sortSanskrit(word: string, otherWord: string): number {
  const wordClean = word.replace('√', '');
  const otherClean = otherWord.replace('√', '');
  return getCachedTransliteration(wordClean) > getCachedTransliteration(otherClean) ? 1 : -1;
}

export default toUrl;