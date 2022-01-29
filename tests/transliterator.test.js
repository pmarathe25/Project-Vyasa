'use strict';

const { transliterate, } = require('../src/util/transliterator.js');

test('basic', () => {
    let trie = require("../build/devanagari_trie.json");
    expect(transliterate("dharma", trie)).toBe("धर्म");
});