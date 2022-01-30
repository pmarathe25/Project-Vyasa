import * as React from 'react'
import { useTransliterate } from './transliterationHook';
import { verseText } from "./verse.module.css"


const Verse = ({ text, wordByWord }) => {
    text = useTransliterate(text);

    return (
        <p className={verseText}>
            {text}
        </p>
    )
}

export default Verse;