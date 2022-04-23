import { Link } from 'gatsby'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import Definition from '../components/definition'
import Layout from '../components/layout'
import OffsetAnchor from '../components/offsetAnchor'
import { useTransliterate } from '../components/transliterationHook'
import { sortSanskrit, toUrl } from '../util/util'

const allWordsDict = require("../../content/generated/dictionary/all_words.json");

const WordAndDefinitions = ({ location, word, definitions, roots, partsOfSpeeches }) => {
    const translitWord = useTransliterate(word);
    const baseUrl = "/dictionary";

    const wordElements = React.useMemo(() => {
        const wordLinkStyle = {
            fontSize: "19px", width: "fit-content",
            display: "inline", padding: 0,
            whiteSpace: "nowrap"
        };

        const wordParts = word.split("-");
        const translitWordParts = translitWord.split("-");
        let ret = [];
        for (let index = 0; index < wordParts.length; ++index) {
            const part = translitWordParts[index];
            ret.push(
                <>
                    <Link key={index} to={`${baseUrl}#${toUrl(wordParts[index])}`} style={wordLinkStyle}>
                        {part}
                    </Link>
                    <p style={wordLinkStyle} key={index}>
                        {(wordParts.length > 1 ? "-" : "")}
                    </p>
                </>
            );
        }
        return ret;
    }, [word, translitWord, baseUrl]);

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
    for (const [word, definitions, roots, partsOfSpeeches] of wordComponents) {
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

    let sectionColumns = [];
    const maxColumns = 3;
    const columnLength = entries.length / maxColumns + 1;
    for (let col = 0; col < maxColumns; col++) {
        const start = col * columnLength;
        const end = start + columnLength;
        let columnEntries = entries.slice(start, end);
        sectionColumns.push(
            <Col key={col}>
                {columnEntries}
            </Col>
        );
    }

    return (
        <>
            <OffsetAnchor id={id}>
                <Link to={url}>
                    <h2>{translitSectionName}</h2>
                </Link>
            </OffsetAnchor>
            <Row xs={1} lg={2} xxl={3} key={sectionName} style={{ marginBottom: "20px" }}>
                {sectionColumns}
            </Row>
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
        <Link to={toUrl(`${baseUrl}#section_${sectionName}`)} style={sectionLinkStyle}>
            {translitSectionName}
        </Link>
    )
}

function getSortedDictSections() {
    let ret = new Map();
    for (let word in allWordsDict) {
        const [sectionName, definitions, roots, partsOfSpeeches] = allWordsDict[word];
        if (!ret.has(sectionName)) {
            ret.set(sectionName, []);
        }
        ret.get(sectionName).push([word, definitions, roots, partsOfSpeeches])
    }
    ret = [...ret.entries()].sort(sortSanskrit);
    for (let elem of ret) {
        elem[1] = elem[1].sort(sortSanskrit);
    }
    return ret;
};

// This will only be computed once when the dictionary is first loaded.
const dictSections = getSortedDictSections();
Object.freeze(dictSections);

const Dictionary = ({ location }) => {
    // Top-bar with links to each section
    let sectionLinks = [];
    let sections = [];
    for (let [sectionName, wordComponents] of dictSections) {
        sectionLinks.push(
            <Col key={sectionName}>
                <SectionLink sectionName={sectionName} />
            </Col>
        )
        sections.push(
            <DictSection
                key={sectionName}
                location={location}
                sectionName={sectionName}
                wordComponents={wordComponents}
            />
        );
    };

    return (
        <Layout location={location} pageTitle="Dictionary">
            <Row style={{ marginBottom: "20px" }}>
                {sectionLinks}
            </Row>
            {sections}
        </Layout >
    );
}

export default Dictionary;