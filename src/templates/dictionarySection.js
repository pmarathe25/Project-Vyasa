import { Link } from 'gatsby'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import allWordsDict from "../../content/generated/dictionary/all_words.json"
import Definition from '../components/definition'
import SectionLinksBar from "../components/dictionarySectionLinksBar"
import Layout from '../components/layout'
import OffsetAnchor from '../components/offsetAnchor'
import { useTransliterate } from '../components/transliterationHook'
import useIsMobile from '../util/responsiveness'
import { sortSanskrit, toDictUrl, toUrl } from '../util/util'


const WordAndDefinitions = ({ location, word }) => {
    const translitWord = useTransliterate(word);
    const isMobile = useIsMobile();

    const fontSize = isMobile ? "var(--mobile-text-font-size)" : "var(--desktop-text-font-size)";

    const wordElements = React.useMemo(() => {
        const wordLinkStyle = {
            fontSize: fontSize, width: "fit-content",
            display: "inline", padding: 0,
            whiteSpace: "nowrap"
        };

        const wordParts = word.split("-");
        const translitWordParts = translitWord.split("-");
        let ret = [];
        for (let index = 0; index < wordParts.length; ++index) {
            const part = translitWordParts[index];
            ret.push(
                <div lang="sa" key={word + index + "div"}>
                    <Link
                        key={word + index}
                        to={toDictUrl(wordParts[index])}
                        style={wordLinkStyle}
                    >
                        {part}
                    </Link>
                    {(wordParts.length > 1 && index !== wordParts.length - 1 ?
                        <p style={wordLinkStyle} key={word + index + "dash"}>
                            -
                        </p>
                        :
                        <></>)}
                </div>
            );
        }
        return ret;
    }, [word, translitWord, fontSize]);

    const id = toUrl(word);
    const isActive = location.hash === `#${id}`;

    return (
        <OffsetAnchor id={id} key={word}>
            <div style={{
                backgroundColor: isActive ? "var(--accent-color)" : "inherit",
                borderRadius: isActive ? "5px" : "inherit",
                paddingBottom: "5px",
                display: "flex",
            }}>
                {wordElements}
                <Definition word={word} makeDefinitionLink={true} />
            </div>
        </OffsetAnchor>
    )
}


function getSortedSectionWords(targetSectionName) {
    let wordList = [];
    for (let word in allWordsDict) {
        const [sectionName] = allWordsDict[word];
        if (targetSectionName !== sectionName) {
            continue;
        }

        wordList.push(word);
    }
    return wordList.sort(sortSanskrit);
}


// Section for words starting with the same letter
const DictSection = ({ location, pageContext }) => {
    const { sectionName } = pageContext;
    const words = getSortedSectionWords(sectionName);

    const translitSectionName = useTransliterate(sectionName);
    const pageUrl = `/dictionary/${sectionName}`;

    let entries = []
    for (const word of words) {
        entries.push(
            <WordAndDefinitions
                key={word + "WordAndDefinitions"}
                location={location}
                word={word}
            />
        );
    }

    let sectionColumns = [];
    const maxColumns = 3;
    const columnLength = entries.length / maxColumns + 1;
    for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
        const start = colIndex * columnLength;
        const end = start + columnLength;
        let columnEntries = entries.slice(start, end);
        sectionColumns.push(
            <Col key={colIndex}>
                {columnEntries}
            </Col>
        );
    }

    return (
        <Layout
            location={location} pageTitle="Dictionary"
            maxWidth="var(--max-content-width)"
            showTranslitButton={true}
            showCurrentPageInBreadcrumbs={false}
        >
            <SectionLinksBar />
            <Link to={pageUrl}>
                <h2 style={{ marginBottom: "10px" }}>{translitSectionName}</h2>
            </Link>
            <Row xs={1} lg={2} xxl={3} key={sectionName} style={{ marginBottom: "20px" }}>
                {sectionColumns}
            </Row>
        </Layout >
    )
}

export default DictSection;
