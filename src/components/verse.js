import { Link } from 'gatsby';
import * as React from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import useIsMobile from "../util/responsiveness";
import toUrl from '../util/util';
import Definition from './definition';
import { useTransliterate } from './transliterationHook';
import { clickableText, verseText } from "./verse.module.css";

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
                            <p style={{ fontSize: "20px", paddingRight: "5px", whiteSpace: "nowrap" }}>
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

const WordWithPopover = ({ word, definition, root, parts_of_speech }) => {
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

    if (!definition && !root && !parts_of_speech) {
        return (<p style={{ padding: "0px", margin: "0px", width: "fit-content", fontSize: "18px" }}>
            {translitWord}
        </p>);

    }

    return (
        <Col style={{ padding: "0px", marginLeft: "5px", marginRight: "5px", width: "fit-content" }}>
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
                    style={{
                        width: "fit-content",
                        marginLeft: "auto", marginRight: "auto",
                        backgroundColor: "var(--text-highlight-color)",
                        color: "rgb(120, 210, 255)",
                        borderRadius: "2px",
                    }}
                >
                    {translitWord}
                </p>
            </OverlayTrigger>
            <p style={{
                fontSize: "14.5px",
                color: "rgb(200, 200, 200)",
                width: "fit-content",
                maxWidth: "110px",
                textAlign: "center",
                marginRight: "auto", marginLeft: "auto",
            }}>
                {definition}
            </p>
        </Col>
    )
}

const WordByWord = ({ wordByWord }) => {
    return (
        <>
            {
                wordByWord.map((line, index) =>
                    <Row
                        key={index}
                        style={{
                            fontSize: "20px",
                            whiteSpace: "pre-wrap",
                            marginLeft: "auto", marginRight: "auto",
                        }}
                        lg="auto"
                    >
                        {
                            line.map(([word, definition, root, parts_of_speech], wordIndex) =>
                                <WordWithPopover
                                    key={index + wordIndex}
                                    word={word}
                                    definition={definition}
                                    root={root}
                                    parts_of_speech={parts_of_speech}
                                />
                            )
                        }
                    </Row>
                )
            }
        </>
    );
}

const Verse = ({ text, wordByWord, translation }) => {
    text = useTransliterate(text);
    const isMobile = useIsMobile();
    const [showWordByWord, setShowWordByWord] = React.useState(false);

    const style = {
        fontSize: "20px",
        paddingBottom: "2px",
    };

    const colStyle = {
        paddingBottom: isMobile ? "15px" : "7px",
        paddingLeft: "0px",
        paddingRight: "0px",
    };

    return (
        <Row className={isMobile ? "row-cols-1" : "row-cols-2"} style={{
            maxWidth: "var(--content-max-width)",
            marginRight: "auto", marginLeft: "auto",
            marginBottom: "20px",
        }}>
            <Col style={colStyle} sm={7}>
                {
                    showWordByWord ?
                        <>
                            <p
                                role="presentation"
                                onClick={() => setShowWordByWord(false)}
                                className={clickableText}
                                style={{
                                    color: "rgba(215, 235, 255, 0.85)",
                                    width: "fit-content",
                                    marginTop: "5px",
                                    marginBottom: "15px",
                                }}>
                                Show Original Text
                            </p>
                            <WordByWord wordByWord={wordByWord} />
                        </>
                        :
                        <p
                            role="presentation"
                            className={verseText}
                            style={{
                                ...style,
                                whiteSpace: "pre-wrap",
                            }}
                            onClick={() => { setShowWordByWord(true); }}>
                            {text}
                        </p >
                }
            </Col>
            <Col sm={5} style={{
                ...style,
                ...colStyle,
                fontSize: "16px",
                color: "var(--text-gray-color)",
            }}>
                {translation}
            </Col>
        </Row >
    );
}

export default Verse;