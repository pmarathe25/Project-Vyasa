import * as React from 'react'
import { transliterate } from '../util/transliterator';
import { verseText } from "./verse.module.css"
import { TranslitModeContext } from './translitModeContext';


const Verse = ({ text, wordByWord }) => {

    const { mode, } = React.useContext(TranslitModeContext);
    const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");
    const iast = require("../../content/generated/transliteration_rulesets/iast.json");

    const translitRuleset = mode ? iast : devanagari;

    return (
        <p className={verseText}>
            {transliterate(text, translitRuleset)}
        </p>
    )
}

export default Verse;