import React from 'react';
import { transliterate } from '../util/transliterator';
import { SettingsContext } from './settingsPanel';

const devanagari = require('../../content/generated/transliteration_rulesets/devanagari.json');
const iast = require('../../content/generated/transliteration_rulesets/iast.json');

// Memoize rulesets to avoid re-creating on each render
const rulesetCache = new Map<string, typeof devanagari>();
rulesetCache.set('devanagari', devanagari);
rulesetCache.set('iast', iast);

// Global transliteration cache shared across components, keyed by text + mode
export const globalTransliterationCache = new Map<string, string>();

export function getCacheKey(text: string, mode: string): string {
  return `${mode}:${text}`;
}

export function useTransliterate(text: string): string {
  const { state } = React.useContext(SettingsContext);

  const output = React.useMemo(() => {
    const translitRuleset = rulesetCache.get(state.translitMode) || devanagari;
    const cacheKey = getCacheKey(text, state.translitMode);
    
    if (globalTransliterationCache.has(cacheKey)) {
      return globalTransliterationCache.get(cacheKey)!;
    }
    
    const result = transliterate(text, translitRuleset);
    globalTransliterationCache.set(cacheKey, result);
    return result;
  }, [text, state.translitMode]);

  return output;
}