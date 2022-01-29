'use strict';

const { transliterate, } = require('../src/util/transliterator.js');

test.each([
    ["dharma", "धर्म"],
    ["dharma karma", "धर्म कर्म"],
    ["vr>n^iitai", "वृणीते"],
])('basic', (orig, expected) => {
    let trie = require("../build/devanagari_trie.json");
    expect(transliterate(orig, trie)).toBe(expected);
});