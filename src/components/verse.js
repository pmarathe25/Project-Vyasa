import * as React from 'react'
import { transliterate } from '../util/transliterator';
import { verseText } from "./verse.module.css"


const Verse = ({ text, wordByWord }) => {
    const trie = require("../../content/generated/transliteration_rulesets/devanagari.json");

    return (
        <p className={verseText}>
            {transliterate(text, trie)}
        </p>
    )
}

export default Verse;