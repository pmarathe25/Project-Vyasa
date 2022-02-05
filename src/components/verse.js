import * as React from 'react';
import { Button, Col, Collapse, Popover, Row, Tab, Tabs, OverlayTrigger } from 'react-bootstrap';
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

const WordAndDefinition = ({ word, definition, root, parts_of_speech }) => {
    word = useTransliterate(word);
    root = useTransliterate(root);

    return (
        <Col>
            <OverlayTrigger
                trigger="hover"
                placement="top"
                overlay={
                    <Popover style={{ backgroundColor: "black", color: "white" }}>
                        <Popover.Body>
                            <Col>
                                <p style={{ fontSize: "20px" }}>
                                    {root}
                                </p>
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
                <div className={verseText} >
                    {wordByWord.map(line =>
                        <Row style={{
                            width: "fit-content", margin: "auto"
                        }}>
                            {
                                line.map(([word, definition, root, parts_of_speech]) =>
                                    <WordAndDefinition word={word} definition={definition} root={root} parts_of_speech={parts_of_speech} />
                                )
                            }
                        </Row>
                    )}
                </div>
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