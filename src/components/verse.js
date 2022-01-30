import * as React from 'react'
import { useTransliterate } from './transliterationHook';
import { verseText } from "./verse.module.css"


const Verse = ({ num, text, wordByWord }) => {
    text = useTransliterate(text);

    return (
        <p className={verseText} id={`verse_${num}`}>
            {text}
        </p>
    )
}

export default Verse;