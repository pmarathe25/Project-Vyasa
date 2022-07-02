import { Link } from 'gatsby';
import * as React from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import useIsMobile from "../util/responsiveness";
import { toDictUrl } from '../util/util';
import Definition from './definition';
import { SettingsContext } from './settingsContext';
import { useTransliterate } from './transliterationHook';
import { clickableText, verseText } from "./verse.module.css";


const RootMeanings = ({ root, fontSize }) => {
    const roots = root.split("+");
    const translitRoots = useTransliterate(root).split("+");

    return (
        <>
            {
                translitRoots.map((rootPar, index) =>
                    <div style={{ display: "flex" }} key={index}>
                        <Link to={toDictUrl(roots[index])} target="_blank"
                            style={{
                                color: "rgb(175, 175, 175)", height: "fit-content", textDecoration: "dashed underline"
                            }}
                        >
                            <p style={{ fontSize: fontSize, paddingRight: "5px", whiteSpace: "nowrap" }}>
                                {rootPar}
                            </p>
                        </Link>
                        <Definition word={roots[index]} />
                    </div>
                )
            }
        </>
    )
}

const WordWithPopover = ({ word, definition, root, parts_of_speech, fontSize }) => {
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
        return (<p style={{ padding: "0px", margin: "0px", width: "fit-content", fontSize: fontSize }}>
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
                                <RootMeanings root={root} fontSize={fontSize} />
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
                        color: "rgb(170, 235, 255)",
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

const WordByWord = ({ wordByWord, fontSize }) => {
    return (
        <>
            {
                wordByWord.map((line, index) =>
                    <Row
                        key={index}
                        style={{
                            fontSize: fontSize,
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
                                    fontSize={fontSize}
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
    const { showTranslation } = React.useContext(SettingsContext);

    const colStyle = {
        paddingLeft: "0px",
        paddingRight: "0px",
        marginLeft: "auto", marginRight: "auto",
        marginTop: showTranslation ? "0px" : "15px",
        marginBottom: "8px",
    };

    const fontSize = isMobile ? "var(--mobile-text-font-size)" : "var(--desktop-text-font-size)";
    const translationFontSize = isMobile ? "var(--mobile-translation-font-size)" : "var(--desktop-translation-font-size)";

    const verseTextComp = (
        <Col style={colStyle}>
            {
                showWordByWord ?
                    <>
                        <WordByWord wordByWord={wordByWord} fontSize={fontSize} />
                        <p
                            role="presentation"
                            onClick={() => setShowWordByWord(false)}
                            className={clickableText}
                            style={{
                                fontSize: translationFontSize,
                                width: "fit-content",
                                marginTop: "10px",
                                color: "rgb(150, 215, 255)"
                            }}>
                            Show Original Text
                        </p>
                    </>
                    :
                    <p
                        role="presentation"
                        className={verseText}
                        style={{
                            fontSize: fontSize,
                            paddingBottom: "2px",
                            whiteSpace: "pre-wrap",
                        }}
                        onClick={() => { setShowWordByWord(true); }}>
                        {text}
                    </p >
            }
        </Col>
    );

    if (!showTranslation) {
        return verseTextComp;
    }

    return (
        <Row className={isMobile ? "row-cols-1" : "row-cols-2"} style={{
            maxWidth: "1100px",
            marginTop: "15px",
            marginLeft: "auto", marginRight: "auto",
            borderBottom: isMobile ? "1px solid rgb(95, 95, 95)" : "",
        }}>
            {
                verseTextComp
            }
            <Col style={{
                ...colStyle,
                fontSize: translationFontSize,
                color: "var(--text-gray-color)",
            }}>
                {translation}
            </Col>
        </Row >
    );
}

export default Verse;