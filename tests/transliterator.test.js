'use strict';

const { transliterate, } = require('../src/util/transliterator.js');

test.each([
    // rr is not a valid sequence, but rr> is, so this should come back unchanges.
    ["rrrr", "rrrr"],
    ["dharma", "धर्म"],
    ["dharma karma", "धर्म कर्म"],
    ["dharma\nkarma", "धर्म\nकर्म"],
    ["vr>n<iitai", "वृणीते"],
    ["yaugas~cittavr>ttiniraudha:", "योगश्चित्तवृत्तिनिरोधः"],
])('basic', (orig, expected) => {
    let ruleset = require("../content/generated/transliteration_rulesets/devanagari.json");
    expect(transliterate(orig, ruleset)).toBe(expected);
});