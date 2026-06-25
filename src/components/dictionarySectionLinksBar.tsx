import { Link } from 'gatsby';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import allWordsDict from '../../content/generated/dictionary/all_words.json';
import { useTransliterate } from './transliterationHook';
import useIsMobile from '../util/responsiveness';
import { sortSanskrit } from '../util/util';

type WordDictEntry = [string, string[], string[], string[]];
const typedAllWordsDict = allWordsDict as unknown as Record<string, WordDictEntry>;

// This is identical for every page, so we can compute and store it.
function getSortedSectionNames(): string[] {
  const sectionNames = new Set<string>();
  for (const word in typedAllWordsDict) {
    const [sectionName] = typedAllWordsDict[word];
    sectionNames.add(sectionName);
  }
  return [...sectionNames].sort(sortSanskrit);
}

const sortedSectionNames = getSortedSectionNames();
Object.freeze(sortedSectionNames);

interface SectionLinkProps {
  sectionName: string;
}

const SectionLink = React.memo(({ sectionName }: SectionLinkProps) => {
  const translitSectionName = useTransliterate(sectionName);
  const isMobile = useIsMobile();

  const fontSize = isMobile ? '19.5px' : '22px';
  const sectionLinkStyle: React.CSSProperties = {
    fontSize,
    width: 'fit-content',
    display: 'inline',
    padding: 0,
  };

  return (
    <Link to={`/dictionary/${sectionName}`} style={sectionLinkStyle}>
      {translitSectionName}
    </Link>
  );
});

// Top-bar with links to each section
const SectionLinksBar = React.memo(() => {
  return (
    <Row lang="sa" style={{ marginBottom: '20px' }}>
      {sortedSectionNames.map((sectionName) => (
        <Col key={sectionName}>
          <SectionLink sectionName={sectionName} />
        </Col>
      ))}
    </Row>
  );
});

export default SectionLinksBar;