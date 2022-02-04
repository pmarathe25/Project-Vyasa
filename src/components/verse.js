import * as React from 'react';
import { Button, Col, Collapse, Tab, Tabs } from 'react-bootstrap';
import { useTransliterate } from './transliterationHook';
import { verseText, verseTextTab } from "./verse.module.css";


const Translation = ({ translation }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <div style={{ width: "max-content", margin: "auto", padding: 0 }}>
                <Button size="sm"
                    onClick={() => { setOpen(!open) }}
                    aria-controls="collapsed-translation-text"
                    aria-expanded={open}
                    style={{ borderRadius: "25px" }}
                >
                    Show Translation
                </Button>
            </div>
            <Collapse in={open}>
                <p className={verseText}>
                    {translation}
                </p>
            </Collapse>
        </div>
    )
}

const WordAndDefinition = ({ word, definition }) => {
    word = useTransliterate(word);

    return (
        <Col>
            <p >
                {word}
            </p>
            <p style={{ fontStyle: "italic" }}>
                {definition}
            </p>
        </Col>
    )
}

const VerseText = ({ num, text, wordByWord }) => {
    text = useTransliterate(text);
    const [key, setKey] = React.useState("text");

    return (
        <Tabs id={"verse-text-tabs-" + num} defaultActiveKey="text" activeKey={key} onSelect={(k) => setKey(k)}
            style={{ borderBottom: "1px solid rgb(80, 80, 80)", marginBottom: "4px" }}
        >
            <Tab eventKey="text" title="Sanskrit Text" tabClassName={verseTextTab}>
                <p className={verseText}>
                    {text}
                </p>
            </Tab>
            <Tab eventKey="word-by-word" title="Word-by-word Translation" tabClassName={verseTextTab}>
                <div className={verseText} style={{ display: "flex" }}>

                    {wordByWord.map(([word, definition]) =>
                        <WordAndDefinition word={word} definition={definition} />
                    )}
                </div>
            </Tab>
        </Tabs>
    )
}

const Verse = ({ num, text, wordByWord, translation }) => {
    return (
        <div style={{
            borderBottom: "2px solid rgb(80, 80, 80)", borderTop: "0px",
            borderRadius: "8px", paddingBottom: "5px", marginBottom: "5px"
        }}>
            <VerseText num={num} text={text} wordByWord={wordByWord} />
            <Translation translation={translation} />
        </div>
    )
}

export default Verse;