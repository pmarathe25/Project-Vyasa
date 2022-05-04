import { Link } from 'gatsby';
import * as React from 'react';
import { Col, Collapse, Container, Nav, OverlayTrigger, Popover, Row, Tab } from 'react-bootstrap';
import { FiLink } from "react-icons/fi";
import useIsMobile from "../util/responsiveness";
import toUrl from '../util/util';
import Definition from './definition';
import OffsetAnchor from './offsetAnchor';
import { useTransliterate } from './transliterationHook';
import { translationText, verseText } from "./verse.module.css";

const allWordsDict = require("../../content/generated/dictionary/all_words.json");

const RootMeanings = ({ root }) => {
    const roots = root.split("+");
    const translitRoots = useTransliterate(root).split("+");

    const rootDefs = React.useMemo(() => {
        let ret = [];
        for (let rootComp of roots) {
            ret.push(allWordsDict[rootComp]);
        }
        return ret;
    }, [roots]);

    return (
        <>
            {
                translitRoots.map((rootPar, index) =>
                    <div style={{ display: "flex" }} key={index}>
                        <Link to={`/dictionary#${toUrl(roots[index])}`} target="_blank"
                            style={{ color: "rgb(125, 155, 170)", height: "fit-content" }}
                        >
                            <p style={{ fontSize: "19px", paddingRight: "5px", whiteSpace: "nowrap" }}>
                                {rootPar}
                            </p>
                        </Link>
                        <Definition
                            definitions={rootDefs[index][1]}
                            roots={rootDefs[index][2]}
                            partsOfSpeeches={rootDefs[index][3]}
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
        document.addEventListener('touchstart', handleClick, true);
        document.addEventListener('touchmove', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('touchstart', handleClick, true);
            document.removeEventListener('touchmove', handleClick, true);
        };
    }, []);

    return (
        <Col
            style={{ padding: "0px", marginLeft: "8px", marginRight: "8px" }}
        >
            <OverlayTrigger
                placement="top"
                overlay={
                    <Popover
                        id={`${word}-popover`}
                        style={{ backgroundColor: "var(--blue-highlight-color)" }}
                        onMouseEnter={() => setShowPopover(true)}
                        onMouseLeave={() => setShowPopover(false)}
                        onTouchStart={() => setShowPopover(true)}
                        onTouchMove={() => setShowPopover(false)}
                    >
                        <Popover.Body ref={popoverRef} style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                            <Col>
                                <RootMeanings root={root} />
                                <p style={{ fontSize: "15px" }}>
                                    {parts_of_speech}
                                </p>
                            </Col>
                        </Popover.Body>
                    </Popover>
                }
                show={showPopover}
            >
                <p
                    ref={ref}
                    role="presentation"
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                    onTouchStart={() => setShowPopover(true)}
                    onTouchMove={() => setShowPopover(false)}
                    style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto" }}
                >
                    {translitWord}
                </p>
            </OverlayTrigger>
            <p style={{
                fontSize: "14.5px",
                color: "rgb(185, 185, 185)",
                width: "fit-content",
                maxWidth: "125px",
                marginLeft: "auto", marginRight: "auto",
            }}>
                {definition}
            </p>
        </Col>
    )
}

const WordByWord = ({ wordByWord }) => {
    return (
        <Container className={verseText}>
            {wordByWord.map((line, index) =>
                <Row
                    key={index}
                    style={{ width: "fit-content", margin: "auto" }}
                    lg="auto"
                >
                    {
                        line.map(([word, definition, root, parts_of_speech], wordIndex) =>
                            <WordAndDefinition
                                key={index + wordIndex}
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
    const isMobile = useIsMobile();

    return (
        <Container style={{ padding: "0px" }}>
            <Row style={{ marginLeft: "0px", maxWidth: "100%" }}>
                <Col sm="auto" style={{
                    position: "absolute", width: "fit-content", padding: "0px", zIndex: 1,
                    color: isMobile ? "rgb(72, 72, 85)" : "rgb(88, 88, 105)",
                    fontSize: "25px",
                }}>
                    {props.num}
                </Col>
                <Col style={{ zIndex: 2, width: "fit-content", padding: "0px" }}>
                    {props.children}
                </Col>
            </Row>
        </Container>
    )
}


const Translation = ({ show, translation }) => {
    return (
        <Collapse in={show} mountOnEnter={true} unmountOnExit={true}>
            <p className={translationText}>
                {translation}
            </p>
        </Collapse>
    )
}

const VerseContent = ({ num, text, wordByWord, location, translation }) => {
    text = useTransliterate(text);
    const isMobile = useIsMobile();
    const [show, setShow] = React.useState(false);

    const url = toUrl(`${location.pathname}#verse_${num}`);

    const tabButtonStyle = { borderRadius: "4px 4px 0px 0px", color: "rgb(225, 225, 225)" };

    const verseTabStyle = {
        fontSize: "14px",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: isMobile ? "5px" : "2px",
        paddingBottom: isMobile ? "5px" : "2px",
        cursor: "pointer",
        ...tabButtonStyle
    };

    return (
        <Tab.Container defaultActiveKey="text" id={"verse-text-tabs-" + num} >
            <Row style={{ width: "fit-content", marginLeft: "0px" }}>
                <Nav variant="pills"
                    style={{
                        borderBottom: "1px solid rgb(75, 75, 75)",
                        marginBottom: isMobile ? "4px" : "1px"
                    }}
                >
                    <Nav.Link eventKey="text" style={verseTabStyle}>
                        Text
                    </Nav.Link>
                    <Nav.Link eventKey="word-by-word" style={verseTabStyle}>
                        Word-by-word
                    </Nav.Link>
                    <Nav.Link onClick={() => { setShow(!show) }}
                        style={{
                            backgroundColor: show ? "rgb(85, 85, 80)" : "inherit",
                            ...verseTabStyle
                        }}>
                        {show ? "Hide" : "Show"} Translation
                    </Nav.Link>
                    <Nav.Link to={url} as={Link} style={{
                        paddingLeft: "4px",
                        paddingTop: "0px", paddingBottom: "0px",
                        ...tabButtonStyle
                    }}>
                        <FiLink size="14px" />
                    </Nav.Link>
                </Nav>
            </Row>
            <Tab.Content>
                <Tab.Pane eventKey="text" mountOnEnter={true} unmountOnExit={true}>
                    <TabContents num={num}>
                        <p className={verseText} style={{ overflowWrap: "anywhere" }}>
                            {text}
                        </p>
                    </TabContents>
                </Tab.Pane>
                <Tab.Pane eventKey="word-by-word" mountOnEnter={true} unmountOnExit={true}>
                    <TabContents num={num}>
                        <WordByWord wordByWord={wordByWord} />
                    </TabContents>
                </Tab.Pane>
                <Translation translation={translation} show={show} />
            </Tab.Content>
        </Tab.Container >
    )
}

const Verse = ({ num, text, wordByWord, translation, location }) => {
    const isMobile = useIsMobile();
    const isActive = location.hash === `#verse_${num}`;

    return (
        <OffsetAnchor id={`verse_${num}`} >
            <div style={{
                minHeight: "80px",
                maxWidth: "var(--content-max-width)",
                marginRight: "auto", marginLeft: "auto",
                marginBottom: isMobile ? "20px" : "1px",
                backgroundColor: isActive ? "rgb(66, 66, 66)" : "inherit",
                borderRadius: "7px",
            }}>
                <VerseContent num={num} text={text} wordByWord={wordByWord} location={location} translation={translation} />
            </div>
        </OffsetAnchor >
    )
}

export default Verse;