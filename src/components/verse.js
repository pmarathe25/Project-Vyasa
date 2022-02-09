import * as React from 'react';
import { Button, Col, Collapse, Container, OverlayTrigger, Popover, Row, Tab, Tabs } from 'react-bootstrap';
import { useTransliterate } from './transliterationHook';
import { translationText, verseText, verseTextTab } from "./verse.module.css";

const allWordsDict = require("../../content/generated/dictionary/all_words.json");

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
                <p className={translationText}>
                    {translation}
                </p>
            </Collapse>
        </div>
    )
}

const RootMeanings = ({ root }) => {
    let rootDefs = [];
    let translitRoots = useTransliterate(root).split("+");
    let rootComponents = root.split("+");
    for (let rootComp of rootComponents) {
        rootDefs.push(allWordsDict[rootComp]);
    }

    return (
        <div>
            {
                translitRoots.map((rootPar, index) =>
                    <div style={{ display: "flex" }} key={index}>
                        <p style={{ fontSize: "20px", paddingRight: "5px" }}>
                            {rootPar}
                        </p>
                        <p style={{ top: "50%", marginTop: "auto", marginBottom: "auto" }}>
                            {rootDefs[index] ? rootDefs[index] : ""}
                        </p>
                    </div>
                )
            }
        </div>
    )
}

const WordAndDefinition = ({ word, definition, root, parts_of_speech }) => {
    word = useTransliterate(word);

    return (
        <Col sm="auto">
            <OverlayTrigger
                placement="top"
                overlay={
                    <Popover style={{ backgroundColor: "rgb(13, 100, 233)" }}>
                        <Popover.Body>
                            <Col>
                                <RootMeanings root={root} />
                                <p style={{ fontSize: "16px" }}>
                                    {parts_of_speech}
                                </p>
                            </Col>
                        </Popover.Body>
                    </Popover>
                }
            >
                <p>
                    {word}
                </p>
            </OverlayTrigger>
            <p style={{ fontStyle: "italic", fontSize: "20px", color: "rgb(175, 175, 175)" }}>
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
                <Container className={verseText} >
                    {wordByWord.map((line, index) =>
                        <Row key={index} style={{
                            width: "fit-content", margin: "auto"
                        }}>
                            {
                                line.map(([word, definition, root, parts_of_speech], wordIndex) =>
                                    <WordAndDefinition key={word + wordIndex} word={word} definition={definition} root={root} parts_of_speech={parts_of_speech} />
                                )
                            }
                        </Row>
                    )}
                </Container>
            </Tab>
        </Tabs >
    )
}

const Verse = ({ num, text, wordByWord, translation }) => {
    return (
        <div id={`verse_${num}`} style={{
            borderBottom: "2px solid rgb(80, 80, 80)", borderTop: "0px",
            borderRadius: "8px", paddingBottom: "5px", marginBottom: "5px"
        }}>
            <VerseText num={num} text={text} wordByWord={wordByWord} />
            <Translation translation={translation} />
        </div>
    )
}

export default Verse;