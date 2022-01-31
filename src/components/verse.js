import * as React from 'react'
import { useTransliterate } from './transliterationHook';
import { verseText, wordByWordButton } from "./verse.module.css"

const WordAndDefinition = ({ word, definition }) => {
    word = useTransliterate(word);

    console.log(word);
    console.log(definition);

    return (
        <div className="stacked">
            <p style={{ padding: 0 }}>
                {word}
            </p>
            <p style={{ fontStyle: "italic", padding: 0 }}>
                {definition}
            </p>
        </div>
    )
}

const Verse = ({ num, text, wordByWord }) => {
    text = useTransliterate(text);
    const [showWordByWord, setShowWordByWord] = React.useState(false);

    return (
        <button className={wordByWordButton} onClick={() => { setShowWordByWord(!showWordByWord) }}
            style={{ opacity: showWordByWord ? 1.0 : 0.4 }}>
            <div className={verseText} id={`verse_${num}`} style={{ display: "flex", justifyContent: "space-around" }}>
                {showWordByWord
                    ?
                    wordByWord.map(([word, definition]) =>
                        < WordAndDefinition word={word} definition={definition} />
                    )
                    :
                    text
                }
            </div>
        </button >
    )
}

export default Verse;