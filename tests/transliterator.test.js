'use strict';

const { transliterate, } = require('../src/util/transliterator.js');

test.each([
    // r>r is not a valid sequence, but r>r> is, so this should come back unchanged.
    ["r>r", "r>r"],
    ["dharma", "धर्म"],
    ["satta", "सत्त"],
    ["la", "ल"],
    ["talla", "तल्ल"],
    ["dharma karma", "धर्म कर्म"],
    ["dharma\nkarma", "धर्म\nकर्म"],
    ["vr>n<iitai", "वृणीते"],
    ["yaugas~cittavr>ttiniraudha:", "योगश्चित्तवृत्तिनिरोधः"],
])('basic', (orig, expected) => {
    let ruleset = require("../content/generated/transliteration_rulesets/devanagari.json");
    expect(transliterate(orig, ruleset)).toBe(expected);
});