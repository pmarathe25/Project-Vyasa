'use strict';

const { transliterate, } = require('../src/util/transliterator.js');

test.each([
    ["dharma", "धर्म"],
    ["dharma karma", "धर्म कर्म"],
    ["vr>n^iitai", "वृणीते"],
    ["yaugas~cittavr>ttiniraudha:", "योगश्चित्तवृत्तिनिरोधः"],
])('basic', (orig, expected) => {
    let ruleset = require("../content/generated/transliteration_rulesets/devanagari.json");
    expect(transliterate(orig, ruleset)).toBe(expected);
});