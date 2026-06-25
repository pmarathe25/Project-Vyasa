import { transliterate } from '../src/util/transliterator';
import devanagari from '../content/generated/transliteration_rulesets/devanagari.json';

test.each([
  // r>r is not a valid sequence, but r>r> is, so this should come back unchanged.
  ['r>r', 'r>r'],
  ['dharma', 'धर्म'],
  ['satta', 'सत्त'],
  ['la', 'ल'],
  ['talla', 'तल्ल'],
  ['dharma karma', 'धर्म कर्म'],
  ['dharma\nkarma', 'धर्म\nकर्म'],
  ['vr>n<iitai', 'वृणीते'],
  ['yaugas~cittavr>ttiniraudha:', 'योगश्चित्तवृत्तिनिरोधः'],
])('basic', (orig, expected) => {
  expect(transliterate(orig, devanagari)).toBe(expected);
});