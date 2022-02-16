import { Link } from 'gatsby';
import * as React from 'react';
import { Button, Col, Collapse, Container, Nav, OverlayTrigger, Popover, Row, Tab } from 'react-bootstrap';
import { FiLink } from "react-icons/fi";
import toUrl from '../util/util';
import Definition from './definition';
import { useTransliterate } from './transliterationHook';
import { translationText, verseText, verseTextTab } from "./verse.module.css";

const allWordsDict = require("../../content/generated/dictionary/all_words.json");

const Translation = ({ translation }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <div style={{ width: "max-content", margin: "auto", padding: 0 }}>
                <Button size="sm"
                    onClick={() => { setOpen(!open) }}
                    aria-controls="collapsed-translation-text"
                    aria-expanded={open}
                    style={{ borderRadius: "25px" }}
                >
                    {open ? "Hide" : "Show"} Translation
                </Button>
            </div>
            <Collapse in={open}>
                <p className={translationText}>
                    {translation}
                </p>
            </Collapse>
        </>
    )
}

const RootMeanings = ({ root }) => {
    const roots = root.split("+");
    const translitRoots = useTransliterate(root).split("+");
    let rootDefs = [];
    for (let rootComp of roots) {
        rootDefs.push(allWordsDict[rootComp]);
    }

    return (
        <>
            {
                translitRoots.map((rootPar, index) =>
                    <div style={{ display: "flex" }} key={index}>
                        <a href={`/dictionary#${toUrl(roots[index])}`} target="_blank">
                            <p style={{ fontSize: "20px", paddingRight: "5px" }}>
                                {rootPar}
                            </p>
                        </a>
                        <Definition
                            definition={rootDefs[index][0]}
                            reference={rootDefs[index][1]}
                            refPartsOfSpeech={rootDefs[index][2]}
                        />
                    </div>
                )
            }
        </>
    )
}

const WordAndDefinition = ({ word, definition, root, parts_of_speech }) => {
    const translitWord = useTransliterate(word);

    const [showPopover, setShowPopover] = React.useState(false);

    // Detect clicks outside the word and popover to make the
    // popover go away on mobile.
    const ref = React.useRef(null);
    const popoverRef = React.useRef(null);
    React.useEffect(() => {
        const handleClick = (event) => {
            const outsideWord = ref.current && !ref.current.contains(event.target);
            const outsidePopover = !popoverRef.current ||
                (popoverRef.current && !popoverRef.current.contains(event.target));

            if (outsideWord && outsidePopover) {
                setShowPopover(false);
            }
        };

        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, []);

    return (
        <Col ref={ref}>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Popover
                        id={`${word}-popover`}
                        style={{ backgroundColor: "rgb(13, 100, 233)" }}
                        onMouseEnter={() => setShowPopover(true)}
                        onMouseLeave={() => setShowPopover(false)}
                        onTouchStart={() => setShowPopover(true)}
                    >
                        <Popover.Body ref={popoverRef} >
                            <Col>
                                <RootMeanings root={root} />
                                <p style={{ fontSize: "16px" }}>
                                    {parts_of_speech}
                                </p>
                            </Col>
                        </Popover.Body>
                    </Popover>
                }
                show={showPopover}
            >
                <p
                    role="presentation"
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                    onTouchStart={() => setShowPopover(true)}
                >
                    {translitWord}
                </p>
            </OverlayTrigger>
            <p style={{ fontStyle: "italic", fontSize: "16px", color: "rgb(175, 175, 175)" }}>
                {definition}
            </p>
        </Col>
    )
}

const WordByWord = ({ wordByWord }) => {
    return (
        <Container className={verseText} >
            {wordByWord.map((line, index) =>
                <Row
                    key={index}
                    style={{ width: "fit-content", margin: "auto" }}
                    lg="auto"
                >
                    {
                        line.map(([word, definition, root, parts_of_speech], wordIndex) =>
                            <WordAndDefinition
                                key={word + wordIndex}
                                word={word}
                                definition={definition}
                                root={root}
                                parts_of_speech={parts_of_speech}
                            />
                        )
                    }
                </Row>
            )}
        </Container>
    );
}

const TabContents = (props) => {
    const overlayNumStyle = {
        width: "fit-content",
        position: "absolute",
        zIndex: 1,
        color: "rgb(70, 70, 70)",
        fontSize: "50px",
        paddingTop: "15px",
    };

    return (
        <Container>
            <Row>
                <Col sm="auto" style={{ position: "absolute" }}>
                    <div style={overlayNumStyle}>
                        {props.num}
                    </div>
                </Col>
                <Col style={{ zIndex: 2 }}>
                    {props.children}
                </Col>
            </Row>
        </Container>
    )
}

const VerseText = ({ num, text, wordByWord, location }) => {
    text = useTransliterate(text);
    const url = toUrl(`${location.pathname}#verse_${num}`);

    return (
        <Tab.Container defaultActiveKey="text" id={"verse-text-tabs-" + num}>
            <Row>
                <Nav variant="pills"
                    style={{ borderBottom: "1px solid rgb(65, 65, 65)", marginBottom: "4px" }}
                >
                    <Nav.Link className={verseTextTab} eventKey="text">
                        Sanskrit Text
                    </Nav.Link>
                    <Nav.Link className={verseTextTab} eventKey="word-by-word">
                        Word-by-word Analysis
                    </Nav.Link>
                    <Nav.Link to={url} as={Link} style={{ paddingLeft: "4px" }}>
                        <FiLink size="18px" />
                    </Nav.Link>
                </Nav>
            </Row>
            <Tab.Content>
                <Tab.Pane eventKey="text">
                    <TabContents num={num}>
                        <p className={verseText} style={{ overflowWrap: "break-word" }}>
                            {text}
                        </p>
                    </TabContents>
                </Tab.Pane>
                <Tab.Pane eventKey="word-by-word">
                    <TabContents num={num}>
                        <WordByWord wordByWord={wordByWord} />
                    </TabContents>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    )
}

const Verse = ({ num, text, wordByWord, translation, location }) => {
    return (
        <div id={`verse_${num}`} style={{
            borderBottom: "2px solid rgb(65, 65, 65)", borderTop: "0px",
            paddingBottom: "5px", marginBottom: "5px"
        }}>
            <VerseText num={num} text={text} wordByWord={wordByWord} location={location} />
            <Translation translation={translation} />
        </div>
    )
}

export default Verse;