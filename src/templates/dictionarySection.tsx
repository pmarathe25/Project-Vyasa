import { Link } from 'gatsby';
import * as React from 'react';
import { Suspense } from 'react';
import { Col, Row } from 'react-bootstrap';
import SectionLinksBar from '../components/dictionarySectionLinksBar';
import Layout from '../components/layout';
import OffsetAnchor from '../components/offsetAnchor';
import { useTransliterate } from '../components/transliterationHook';
import { sortSanskrit, toDictUrl, toUrl } from '../util/util';

const Definition = React.lazy(() => import('../components/definition').then((mod) => ({ default: mod.default })));

interface PageContext {
  sectionName: string;
  words: string[];
}

interface WordAndDefinitionsProps {
  location: { hash: string; pathname: string };
  word: string;
}

const WordAndDefinitions = ({ location, word }: WordAndDefinitionsProps) => {
  const translitWord = useTransliterate(word);

  const wordElements = React.useMemo(() => {
    const wordLinkStyle: React.CSSProperties = {
      fontSize: 'var(--sanskrit-font-size)',
      width: 'fit-content',
      display: 'inline',
      padding: 0,
      whiteSpace: 'nowrap',
      textDecorationThickness: '1px',
    };

    const wordParts = word.split('-');
    const translitWordParts = translitWord.split('-');
    const ret: React.ReactElement[] = [];
    for (let index = 0; index < wordParts.length; ++index) {
      const part = translitWordParts[index];
      ret.push(
        <div lang="sa" key={`${word}${index}div`}>
          {wordParts.length > 1 ? (
            <Link key={`${word}${index}`} to={toDictUrl(wordParts[index])} style={wordLinkStyle}>
              {part}
            </Link>
          ) : (
            <p style={wordLinkStyle}>{part}</p>
          )}
          {wordParts.length > 1 && index !== wordParts.length - 1 ? (
            <p style={wordLinkStyle} key={`${word}${index}dash`}>
              -
            </p>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return ret;
  }, [word, translitWord]);

  const id = toUrl(word);
  const isActive = location.hash === `#${id}`;

  return (
    <OffsetAnchor id={id} key={word}>
      <div
        style={{
          backgroundColor: isActive ? 'var(--accent-color)' : 'inherit',
          borderRadius: isActive ? '5px' : 'inherit',
          paddingBottom: '5px',
          display: 'flex',
        }}
      >
        {wordElements}
        <Suspense fallback={<div style={{ padding: '5px' }}>Loading definition...</div>}>
          <Definition word={word} />
        </Suspense>
      </div>
    </OffsetAnchor>
  );
};

// Section for words starting with the same letter
interface DictSectionProps {
  location: { pathname: string; hash: string };
  pageContext: PageContext;
}

const DictSection = ({ location, pageContext }: DictSectionProps) => {
  const { sectionName, words } = pageContext;
  const sortedWords = words.sort(sortSanskrit);

  const translitSectionName = useTransliterate(sectionName);
  const pageUrl = `/dictionary/${sectionName}`;

  const entries = words.map((word) => (
    <WordAndDefinitions key={`${word}WordAndDefinitions`} location={location} word={word} />
  ));

  const sectionColumns: React.ReactElement[] = [];
  const maxColumns = 3;
  const columnLength = entries.length / maxColumns + 1;
  for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
    const start = colIndex * columnLength;
    const end = start + columnLength;
    const columnEntries = entries.slice(start, end);
    sectionColumns.push(
      <Col key={colIndex}>{columnEntries}</Col>
    );
  }

  return (
    <Layout
      location={location}
      pageTitle="Dictionary"
      maxWidth="var(--max-content-width)"
      showCurrentPageInBreadcrumbs={false}
      showTranslitButton={true}
    >
      <SectionLinksBar />
      <Link to={pageUrl}>
        <h2 style={{ marginBottom: '10px' }}>{translitSectionName}</h2>
      </Link>
      <Row xs={1} lg={2} xxl={3} key={sectionName} style={{ marginBottom: '20px' }}>
        {sectionColumns}
      </Row>
    </Layout>
  );
};

export default DictSection;