import React from 'react';
import { transliterate } from '../util/transliterator';
import { SettingsContext } from './settingsPanel';
import { TransliterationRuleset } from '../util/transliterator';
import devanagari from '../../content/generated/transliteration_rulesets/devanagari.json';
import iast from '../../content/generated/transliteration_rulesets/iast.json';

const MAX_CACHE_SIZE = 1000;

interface LRUCacheEntry {
  value: string;
  timestamp: number;
}

const rulesetCache = new Map<string, TransliterationRuleset>();
rulesetCache.set('devanagari', devanagari);
rulesetCache.set('iast', iast);

export const globalTransliterationCache = new Map<string, LRUCacheEntry>();

function evictOldest(): void {
  if (globalTransliterationCache.size >= MAX_CACHE_SIZE) {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of globalTransliterationCache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      globalTransliterationCache.delete(oldestKey);
    }
  }
}

export function getCacheKey(text: string, mode: string): string {
  return `${mode}:${text}`;
}

export function useTransliterate(text: string): string {
  const { state } = React.useContext(SettingsContext);

  const output = React.useMemo(() => {
    const translitRuleset = rulesetCache.get(state.translitMode) || devanagari;
    const cacheKey = getCacheKey(text, state.translitMode);
    
    const cached = globalTransliterationCache.get(cacheKey);
    if (cached) {
      cached.timestamp = Date.now();
      return cached.value;
    }
    
    evictOldest();
    
    const result = transliterate(text, translitRuleset);
    globalTransliterationCache.set(cacheKey, { value: result, timestamp: Date.now() });
    return result;
  }, [text, state.translitMode]);

  return output;
}