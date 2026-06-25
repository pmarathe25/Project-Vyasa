import { Link } from 'gatsby';
import * as React from 'react';
import { Container, Row } from 'react-bootstrap';
import allWordsDict from '../../content/generated/dictionary/all_words.json';
import { useTransliterate } from './transliterationHook';
import { toDictUrl } from '../util/util';

type WordDictEntry = [string, string[], string[], string[]];
const typedAllWordsDict = allWordsDict as unknown as Record<string, WordDictEntry>;

const commonStyle: React.CSSProperties = {
  padding: 0,
  width: 'fit-content',
  color: 'var(--text-secondary)',
  fontSize: 'var(--tertiary-font-size)',
};

interface RootProps {
  root: string;
  partsOfSpeech: string;
}

const Root = React.memo(function Root({ root, partsOfSpeech }: RootProps) {
  const translitRootParts = useTransliterate(root).split('+');

  if (!root) {
    return <></>;
  }

  const rootParts = root.split('+');
  const refLinks = translitRootParts.map((translitPart, index) => (
    <div lang="sa" style={{ marginLeft: '2px', display: 'inline-block', ...commonStyle }} key={index}>
      {index > 0 ? ', ' : ''}
      <Link
        to={toDictUrl(rootParts[index])}
        style={{ fontSize: 'var(--sanskrit-small-font-size)', fontStyle: 'normal', whiteSpace: 'nowrap' }}
        key={index}
      >
        {translitPart}
      </Link>
    </div>
  ));

  return (
    <div style={{ marginLeft: '4px', display: 'inline-block', ...commonStyle }}>
      {partsOfSpeech ? (
        <>
          [{partsOfSpeech} of {refLinks}]
        </>
      ) : (
        <>
          [see {refLinks}]
        </>
      )}
    </div>
  );
});

interface DefinitionProps {
  word: string;
}

const Definition = React.memo(function Definition({ word }: DefinitionProps) {
  const entry = React.useMemo(() => {
    return typedAllWordsDict[word];
  }, [word]);

  if (!entry) {
    return <></>;
  }

  const [, definitions, roots, partsOfSpeeches] = entry;

  const definitionElements = definitions.map((definition, index) => (
    <Row key={index} style={{ marginLeft: '5px', marginRight: '0px', ...commonStyle }}>
      <p style={commonStyle}>{definition}</p>
      <Root root={roots[index]} partsOfSpeech={partsOfSpeeches[index]} />
    </Row>
  ));

  return (
    <Container style={{ marginTop: 'auto', marginBottom: 'auto', padding: '0px', paddingLeft: '0px', paddingRight: '5px' }}>
      {definitionElements}
    </Container>
  );
});

export default Definition;