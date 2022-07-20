import { Link } from 'gatsby';
import * as React from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import useIsMobile from "../util/responsiveness";
import { toDictUrl } from '../util/util';
import Definition from './definition';
import { SettingsContext } from './settingsPanel';
import { useTransliterate } from './transliterationHook';
import { clickableText, verseText } from "./verse.module.css";


const RootMeanings = ({ root }) => {
    const roots = root.split("+");
    const translitRoots = useTransliterate(root).split("+");

    return (
        <>
            {
                translitRoots.map((rootPar, index) =>
                    <div key={index}>
                        <Link to={toDictUrl(roots[index])} target="_blank"
                            style={{
                                fontSize: "var(--sanskrit-font-size)",
                                whiteSpace: "nowrap",
                                height: "fit-content",
                            }}
                        >
                            {rootPar}
                        </Link>
                        <Definition word={roots[index]} marginLeft="15px" />
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
        return (
            <p style={{ padding: "0px", margin: "0px", width: "fit-content", fontSize: "var(--sanskrit-font-size)" }}>
                {translitWord}
            </p>
        );
    }

    return (
        <Col style={{ padding: "0px", marginLeft: "5px", marginRight: "5px", width: "fit-content" }}>
            <OverlayTrigger
                placement="top"
                show={showPopover}
                overlay={
                    <Popover
                        id={`${word}-popover`}
                        style={{ backgroundColor: "var(--accent-color)" }}
                        onMouseEnter={() => setShowPopover(true)}
                        onMouseLeave={() => setShowPopover(false)}
                        onTouchStart={() => setShowPopover(true)}
                        onTouchMove={() => setShowPopover(false)}
                        show={showPopover}
                    >
                        <Popover.Body ref={popoverRef} style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                            <Col>
                                <RootMeanings root={root} />
                                <p style={{ fontSize: "var(--tertiary-font-size)" }}>
                                    {parts_of_speech}
                                </p>
                            </Col>
                        </Popover.Body>
                    </Popover>
                }
            >
                <p
                    lang="sa"
                    ref={ref}
                    role="presentation"
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                    onTouchStart={() => setShowPopover(true)}
                    onTouchMove={() => setShowPopover(false)}
                    style={{
                        width: "fit-content",
                        marginLeft: "auto", marginRight: "auto",
                        backgroundColor: "var(--highlight-color)",
                        color: "var(--text-alternate)",
                        borderRadius: "2px",
                    }}
                >
                    {translitWord}
                </p>
            </OverlayTrigger>

            <p style={{
                fontSize: "var(--tertiary-font-size)",
                color: "var(--text-tertiary)",
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
                            fontSize: "var(--sanskrit-font-size)",
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
    const { showTranslation } = React.useContext(SettingsContext);

    const colStyle = {
        paddingLeft: "0px",
        paddingRight: "0px",
        marginLeft: "auto", marginRight: "auto",
        marginTop: showTranslation ? "0px" : "15px",
        marginBottom: "8px",
    };

    const translationFontSize = "var(--secondary-font-size)";

    const verseTextComp = (
        <Col style={colStyle}>
            {
                showWordByWord ?
                    <>
                        <WordByWord wordByWord={wordByWord} />
                        <p
                            role="presentation"
                            onClick={() => setShowWordByWord(false)}
                            className={clickableText}
                            style={{
                                fontSize: translationFontSize,
                                width: "fit-content",
                                marginTop: "10px",
                            }}>
                            Show Original Text
                        </p>
                    </>
                    :
                    <p
                        lang="sa"
                        role="presentation"
                        className={verseText}
                        style={{
                            fontSize: "var(--sanskrit-font-size)",
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
            marginTop: "15px",
            marginLeft: "auto", marginRight: "auto",
            borderBottom: isMobile ? "1px solid var(--highlight-color)" : "",
        }}>
            {
                verseTextComp
            }
            <Col style={{
                ...colStyle,
                fontSize: translationFontSize,
                color: "var(--text-tertiary)",
            }}>
                {translation}
            </Col>
        </Row >
    );
}

export default Verse;