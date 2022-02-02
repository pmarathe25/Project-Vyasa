import * as React from 'react'
import { useTransliterate } from './transliterationHook';
import { verseText, wordByWordButton, translationAccordion } from "./verse.module.css"
import { Accordion, Col, Container, Row, ToggleButton } from 'react-bootstrap';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';


const WordAndDefinition = ({ word, definition }) => {
    word = useTransliterate(word);

    console.log(word);
    console.log(definition);

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
    const [showWordByWord, setShowWordByWord] = React.useState(false);

    return (
        <Container fluid>
            <Row>
                <Col xxl={2}>
                    <ToggleButton
                        id={"toggle-word-by-word-" + num}
                        type="checkbox"
                        variant="outline-dark"
                        className={wordByWordButton}
                        checked={showWordByWord}
                        value="1"
                        onChange={(e) => { setShowWordByWord(e.currentTarget.checked) }}>
                        {
                            showWordByWord ? "Show Sanskrit Text" : "Word-by-word Analysis"}
                    </ToggleButton>
                </Col>
                <Col xxl={0}>
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
                </Col>
            </Row>
            <Row>
            </Row>
        </Container >
    )
}

const Verse = ({ num, text, wordByWord, translation }) => {
    return (
        <Accordion variant="dark" className={translationAccordion} flush>
            <AccordionItem variant="dark" eventKey={num} className={translationAccordion}>
                <Accordion.Header variant="dark" className={translationAccordion}>
                    <VerseText num={num} text={text} wordByWord={wordByWord} />
                </Accordion.Header>
                <Accordion.Body variant="dark" className={translationAccordion}>
                    <p>{translation}</p>
                </Accordion.Body>
            </AccordionItem>
        </Accordion>
    )
}

export default Verse;