import { Link } from 'gatsby'
import * as React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FiLink } from "react-icons/fi"
import Definition from '../components/definition'
import Layout from '../components/layout'
import { useTransliterate } from '../components/transliterationHook'
import { sortSanskrit, toUrl } from '../util/util'

const allWordsDict = require("../../content/generated/dictionary/all_words.json");


const WordAndDefinition = ({ location, word, definition, reference, refPartsOfSpeech }) => {
    const translitWord = useTransliterate(word);
    const baseUrl = "/dictionary";
    const id = toUrl(`${word}`);

    const wordLinkStyle = {
        fontSize: "22px", width: "fit-content",
        display: "inline", padding: 0,
    };

    const wordParts = word.split("-");
    const translitWordParts = translitWord.split("-");
    let wordElements = [];
    for (let index in wordParts) {
        const part = (
            <p style={wordLinkStyle}>
                {translitWordParts[index]}
            </p>
        );
        wordElements.push(
            <div key={index} style={wordLinkStyle}>
                <p style={wordLinkStyle}>
                    {(index > 0 ? "-" : "")}
                </p>
                {index == (wordParts.length - 1) && index > 0
                    ? (
                        <Link to={`${baseUrl}#${toUrl(wordParts[index])}`} style={wordLinkStyle}>

                            {part}
                        </Link>
                    )
                    : part
                }
            </div>
        );
    }

    const isActive = location.hash == `#${id}`;

    return (
        <div id={id} style={{
            marginBottom: "8px",
            backgroundColor: isActive ? "rgb(81, 150, 214)" : "inherit",
            borderRadius: isActive ? "5px" : "inherit",
            borderBottom: "1px solid rgb(65, 65, 65)"
        }}>
            <Link to={`${baseUrl}#${id}`} style={{
                width: "fit-content", margin: "auto", padding: 0, backgroundColor: "inherit"
            }}>
                <FiLink size="14px" style={{ backgroundColor: "inherit", paddingRight: "2px" }} />
            </Link>
            {wordElements}
            <Definition
                definition={definition}
                reference={reference}
                refPartsOfSpeech={refPartsOfSpeech}
            />
        </div>
    )
}

const DictSection = ({ location, sectionName, wordComponents }) => {
    sectionName = useTransliterate(sectionName);

    let entries = []
    for (const [word, definition, reference, refPartsOfSpeech] of wordComponents.sort(
        ([word], [other]) => {
            return sortSanskrit(word, other);
        })) {
        entries.push(
            <WordAndDefinition
                key={word}
                location={location}
                word={word}
                definition={definition}
                reference={reference}
                refPartsOfSpeech={refPartsOfSpeech}
            />
        );
    }

    return (
        <>
            <h2>{sectionName}</h2>
            {entries}
        </>
    )
}

const Dictionary = ({ location }) => {
    let dictSections = new Map();
    for (let word in allWordsDict) {
        const [definition, ref, refPartsOfSpeech, sectionName] = allWordsDict[word];
        if (!dictSections.has(sectionName)) {
            dictSections.set(sectionName, []);
        }
        dictSections.get(sectionName).push([word, definition, ref, refPartsOfSpeech])
    }

    let sections = [];
    for (let [sectionName, wordComponents] of [...dictSections.entries()].sort(
        ([word], [other]) => {
            return sortSanskrit(word, other);
        }
    )) {
        sections.push(
            <Col key={sectionName} style={{ width: "fit-content", minWidth: "50%", marginBottom: "20px" }}>
                <DictSection
                    location={location}
                    sectionName={sectionName}
                    wordComponents={wordComponents}
                />
            </Col>
        );
    };

    return (
        <Layout location={location} pageTitle="Dictionary">
            <Container>
                <Row >
                    {sections}
                </Row>
            </Container>
        </Layout >
    );
}

export default Dictionary;