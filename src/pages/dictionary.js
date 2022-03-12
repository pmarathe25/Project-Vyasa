import { Link } from 'gatsby'
import * as React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FiLink } from "react-icons/fi"
import Definition from '../components/definition'
import Layout from '../components/layout'
import OffsetAnchor from '../components/offsetAnchor'
import { useTransliterate } from '../components/transliterationHook'
import { sortSanskrit, toUrl } from '../util/util'

const allWordsDict = require("../../content/generated/dictionary/all_words.json");


const WordAndDefinition = ({ location, word, definition, root, partsOfSpeech }) => {
    const translitWord = useTransliterate(word);
    const baseUrl = "/dictionary";

    const wordLinkStyle = {
        fontSize: "22px", width: "fit-content",
        display: "inline", padding: 0,
    };

    const wordParts = word.split("-");
    const translitWordParts = translitWord.split("-");
    let wordElements = [];
    for (let index = 0; index < wordParts.length; ++index) {
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
                {index === (wordParts.length - 1) && index > 0
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

    const id = toUrl(word);
    const isActive = location.hash === `#${id}`;

    return (
        <OffsetAnchor id={id}>
            <div style={{
                marginBottom: "8px",
                backgroundColor: isActive ? "var(--blue-highlight-color)" : "inherit",
                borderRadius: isActive ? "5px" : "inherit",
            }}>
                <Link to={`${baseUrl}#${id}`} style={{
                    width: "fit-content", margin: "auto", padding: 0, backgroundColor: "inherit"
                }}>
                    <FiLink size="14px" style={{ backgroundColor: "inherit", paddingRight: "2px" }} />
                </Link>
                {wordElements}
                <Definition
                    definition={definition}
                    root={root}
                    partsOfSpeech={partsOfSpeech}
                />
            </div>
        </OffsetAnchor>
    )
}

const DictSection = ({ location, sectionName, wordComponents }) => {
    const translitSectionName = useTransliterate(sectionName);

    let entries = []
    for (const [word, definition, root, partsOfSpeech] of wordComponents.sort(
        ([word], [other]) => {
            return sortSanskrit(word, other);
        })) {
        entries.push(
            <WordAndDefinition
                key={word}
                location={location}
                word={word}
                definition={definition}
                root={root}
                partsOfSpeech={partsOfSpeech}
            />
        );
    }

    return (
        <>
            <Link to={toUrl(`/dictionary#section_${sectionName}`)}>
                <h2>{translitSectionName}</h2>
            </Link>
            {entries}
        </>
    )
}

const SectionLink = ({ sectionName }) => {
    const translitSectionName = useTransliterate(sectionName);

    const sectionLinkStyle = {
        fontSize: "22px", width: "fit-content",
        display: "inline", padding: 0,
    };

    return (
        <Link to={toUrl(`/dictionary#section_${sectionName}`)}>
            <p style={sectionLinkStyle}>
                {translitSectionName}
            </p>
        </Link>
    )
}

const Dictionary = ({ location }) => {
    let dictSections = new Map();
    for (let word in allWordsDict) {
        const [definition, ref, partsOfSpeech, sectionName] = allWordsDict[word];
        if (!dictSections.has(sectionName)) {
            dictSections.set(sectionName, []);
        }
        dictSections.get(sectionName).push([word, definition, ref, partsOfSpeech])
    }

    // Top-bar with links to eacch section
    let sectionLinks = [];
    let sections = [];
    for (let [sectionName, wordComponents] of [...dictSections.entries()].sort(
        ([word], [other]) => {
            return sortSanskrit(word, other);
        }
    )) {
        sectionLinks.push(
            <Col key={sectionName}>
                <SectionLink sectionName={sectionName} />
            </Col>
        )
        sections.push(
            <OffsetAnchor id={toUrl(`section_${sectionName}`)}>
                <Col key={sectionName}
                    style={{
                        width: "fit-content", minWidth: "50%", marginBottom: "20px"
                    }}
                >
                    <DictSection
                        location={location}
                        sectionName={sectionName}
                        wordComponents={wordComponents}
                    />
                </Col>
            </OffsetAnchor>
        );
    };

    return (
        <Layout location={location} pageTitle="Dictionary">
            <Container>
                <Row style={{ marginBottom: "20px" }}>
                    {sectionLinks}
                </Row>
                <Row>
                    {sections}
                </Row>
            </Container>
        </Layout >
    );
}

export default Dictionary;