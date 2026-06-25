import React from 'react';
import { transliterate } from '../util/transliterator';
import { SettingsContext } from './settingsPanel';

const devanagari = require('../../content/generated/transliteration_rulesets/devanagari.json');
const iast = require('../../content/generated/transliteration_rulesets/iast.json');

// Memoize rulesets to avoid re-creating on each render
const rulesetCache = new Map<string, typeof devanagari>();
rulesetCache.set('devanagari', devanagari);
rulesetCache.set('iast', iast);

export function useTransliterate(text: string): string {
  const { state } = React.useContext(SettingsContext);

  const output = React.useMemo(() => {
    const translitRuleset = rulesetCache.get(state.translitMode) || devanagari;
    return transliterate(text, translitRuleset);
  }, [text, state.translitMode]);

  return output;
}