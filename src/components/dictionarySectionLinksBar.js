import { Link } from 'gatsby'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import allWordsDict from "../../content/generated/dictionary/all_words.json"
import { useTransliterate } from '../components/transliterationHook'
import useIsMobile from '../util/responsiveness'
import { sortSanskrit } from '../util/util'

// This is identical for every page, so we can compute and store it.
function getSortedSectionNames() {
    let sectionNames = new Set();
    for (let word in allWordsDict) {
        const [sectionName] = allWordsDict[word];
        sectionNames.add(sectionName);
    }
    return [...sectionNames.keys()].sort(sortSanskrit);
}

const sortedSectionNames = getSortedSectionNames();
Object.freeze(sortedSectionNames);

const SectionLink = ({ sectionName }) => {
    const translitSectionName = useTransliterate(sectionName);
    const isMobile = useIsMobile();
    const baseUrl = "/dictionary";

    const fontSize = isMobile ? "19.5px" : "22px";
    const sectionLinkStyle = {
        fontSize: fontSize, width: "fit-content",
        display: "inline", padding: 0,
    };

    return (
        <Link to={`${baseUrl}/${sectionName}`} style={sectionLinkStyle}>
            {translitSectionName}
        </Link>
    )
}

// Top-bar with links to each section
const SectionLinksBar = React.memo(() => {
    return (
        <Row style={{ marginBottom: "20px" }}>
            {
                sortedSectionNames.map((sectionName) =>
                    <Col key={sectionName}>
                        <SectionLink sectionName={sectionName} />
                    </Col>
                )
            }
        </Row>
    );
});

export default SectionLinksBar;