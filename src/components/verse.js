import * as React from 'react'
import { useTransliterate } from './transliterationHook';
import { verseText, wordByWordButton } from "./verse.module.css"
import { Col, Container, Row, ToggleButton } from 'react-bootstrap';


const WordAndDefinition = ({ word, definition }) => {
    word = useTransliterate(word);

    console.log(word);
    console.log(definition);

    return (
        <Col>
            <p style={{ padding: 0 }}>
                {word}
            </p>
            <p style={{ fontStyle: "italic", padding: 0 }}>
                {definition}
            </p>
        </Col>
    )
}

const Verse = ({ num, text, wordByWord }) => {
    text = useTransliterate(text);
    const [showWordByWord, setShowWordByWord] = React.useState(false);

    return (
        <Container fluid>
            <Row>
                <Col xxl={1}>
                    <ToggleButton
                        id={"toggle-word-by-word-" + num}
                        type="checkbox"
                        variant="outline-dark"
                        className={wordByWordButton}
                        checked={showWordByWord}
                        value="1"
                        onChange={(e) => { setShowWordByWord(e.currentTarget.checked) }}>
                        {
                            showWordByWord ? "Show Sanskrit Text" : "Translate"}
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
        </Container >
    )
}

export default Verse;