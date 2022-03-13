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


const WordAndDefinitions = ({ location, word, definitions, roots, partsOfSpeeches }) => {
    const translitWord = useTransliterate(word);
    const baseUrl = "/dictionary";

    const wordLinkStyle = {
        fontSize: "22px", width: "fit-content",
        display: "inline", padding: 0,
        whiteSpace: "nowrap"
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
                backgroundColor: isActive ? "var(--blue-highlight-color)" : "inherit",
                borderRadius: isActive ? "5px" : "inherit",
                paddingBottom: "5px",
                display: "flex",
            }}>
                <Link to={`${baseUrl}#${id}`} style={{
                    width: "fit-content", margin: "auto", padding: 0,
                }}>
                    <FiLink size="16px" style={{ paddingRight: "5px", marginBottom: "5px" }} />
                </Link>
                {wordElements}
                <Definition
                    definitions={definitions}
                    roots={roots}
                    partsOfSpeeches={partsOfSpeeches}
                />
            </div>
        </OffsetAnchor>
    )
}

const DictSection = ({ location, sectionName, wordComponents }) => {
    const translitSectionName = useTransliterate(sectionName);
    const baseUrl = "/dictionary";
    const id = toUrl(`section_${sectionName}`);
    const url = toUrl(`${baseUrl}#${id}`);

    let entries = []
    for (const [word, definitions, roots, partsOfSpeeches] of wordComponents.sort(
        ([word], [other]) => {
            return sortSanskrit(word, other);
        })) {
        entries.push(
            <WordAndDefinitions
                key={word}
                location={location}
                word={word}
                definitions={definitions}
                roots={roots}
                partsOfSpeeches={partsOfSpeeches}
            />
        );
    }

    return (
        <>
            <OffsetAnchor id={id}>
                <Link to={url}>
                    <h2>{translitSectionName}</h2>
                </Link>
            </OffsetAnchor>
            {entries}
        </>
    )
}

const SectionLink = ({ sectionName }) => {
    const translitSectionName = useTransliterate(sectionName);
    const baseUrl = "/dictionary";

    const sectionLinkStyle = {
        fontSize: "22px", width: "fit-content",
        display: "inline", padding: 0,
    };

    return (
        <Link to={toUrl(`${baseUrl}#section_${sectionName}`)}>
            <p style={sectionLinkStyle}>
                {translitSectionName}
            </p>
        </Link>
    )
}

const Dictionary = ({ location }) => {
    let dictSections = new Map();
    for (let word in allWordsDict) {
        const [sectionName, definitions, roots, partsOfSpeeches] = allWordsDict[word];
        if (!dictSections.has(sectionName)) {
            dictSections.set(sectionName, []);
        }
        dictSections.get(sectionName).push([word, definitions, roots, partsOfSpeeches])
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
            <Col key={sectionName} style={{ marginBottom: "20px" }}>
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
            <Container fluid>
                <Row style={{ marginBottom: "20px" }}>
                    {sectionLinks}
                </Row>
                <Row xs={1} lg={2} xxl={3}>
                    {sections}
                </Row>
            </Container>
        </Layout >
    );
}

export default Dictionary;