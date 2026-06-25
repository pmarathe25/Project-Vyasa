export interface TransliterationRuleset {
  sequence_map: TrieNode;
  rules: {
    'replace-sequence': Record<string, string>;
  };
  compiledReplacePatterns?: Array<{ pattern: RegExp; replacement: string }>;
}

interface TrieNode {
  [key: string]: TrieNode | string;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compileReplacePatterns(ruleset: TransliterationRuleset): void {
  if (ruleset.rules['replace-sequence'] && !ruleset.compiledReplacePatterns) {
    ruleset.compiledReplacePatterns = Object.entries(ruleset.rules['replace-sequence']).map(
      ([inpSeq, outSeq]) => ({
        pattern: new RegExp(escapeRegExp(inpSeq), 'g'),
        replacement: outSeq,
      })
    );
  }
}

export function transliterate(text: string, translitRuleset: TransliterationRuleset): string {
  const sequenceMap = translitRuleset.sequence_map;
  const rules = translitRuleset.rules;

  let output = '';
  let curDict: TrieNode = sequenceMap;
  let curSequence = '';

  for (let idx = 0; idx < text.length; ++idx) {
    const curChar = text[idx];
    const nextChar = text[idx + 1];

    if (curChar in curDict) {
      curDict = curDict[curChar] as TrieNode;
      curSequence += curChar;
    } else {
      output += curChar;
    }

    if (!(nextChar in curDict)) {
      if ('' in curDict) {
        output += curDict[''] as string;
        curDict = sequenceMap;
      } else {
        output += curSequence;
      }
      curSequence = '';
    }
  }

  if (rules['replace-sequence']) {
    compileReplacePatterns(translitRuleset);
    if (translitRuleset.compiledReplacePatterns) {
      for (const { pattern, replacement } of translitRuleset.compiledReplacePatterns || []) {
        output = output.replace(pattern, replacement);
      }
    }
  }

  return output;
}