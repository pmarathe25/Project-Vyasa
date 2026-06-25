import { graphql } from 'gatsby';
import * as React from 'react';
import { Suspense } from 'react';
import Layout from '../../../components/layout';
import { SettingsContext } from '../../../components/settingsPanel';
import { useTransliterate } from '../../../components/transliterationHook';
import useIsMobile from '../../../util/responsiveness';

const Verse = React.lazy(() => import('../../../components/verse').then((mod) => ({ default: mod.default })));

interface SectionTitleProps {
  data: {
    textJson: {
      section: string;
    };
  };
}

const SectionTitle = ({ data }: SectionTitleProps) => {
  const tranlistSection = useTransliterate(data.textJson.section);

  return <h2 style={{ marginBottom: '5px' }}>{tranlistSection}</h2>;
};

interface SectionSubtitleProps {
  data: {
    textJson: {
      sectionName: string;
    };
  };
}

const SectionSubtitle = ({ data }: SectionSubtitleProps) => {
  const tranlistSectionName = useTransliterate(data.textJson.sectionName);

  return (
    <h3
      style={{
        color: 'var(--text-secondary)',
        marginBottom: '30px',
        fontSize: 'var(--sanskrit-large-font-size)',
      }}
    >
      {tranlistSectionName}
    </h3>
  );
};

interface VerseNode {
  text: string;
  wordByWord: Array<Array<[string, string, string, string]>>;
  translation: string;
}

interface TextJsonData {
  id: string;
  section: string;
  sectionName: string;
  verses: VerseNode[];
}

interface SectionProps {
  location: { pathname: string };
  data: {
    textJson: TextJsonData;
  };
}

const Section = ({ location, data }: SectionProps) => {
  const { state } = React.useContext(SettingsContext);
  const { showTranslation } = state;
  const isMobile = useIsMobile();

  return (
    <Layout
      location={location}
      pageTitle={data.textJson.section}
      maxWidth={showTranslation ? 'var(--max-content-width)' : 'var(--small-content-width)'}
      showTranslitButton={true}
      showTranslationButton={true}
    >
      <SectionTitle data={data} />
      <SectionSubtitle data={data} />
      <p
        style={{
          textAlign: 'center',
          color: 'var(--text-alternate)',
          fontSize: 'var(--tertiary-font-size)',
          marginBottom: '35px',
        }}
      >
        {isMobile ? 'Tap' : 'Click'} on Sanskrit text to see word-level analysis
      </p>
      {data.textJson.verses.map((node, index) => (
        <Suspense key={index} fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading verse...</div>}>
          <Verse text={node.text} wordByWord={node.wordByWord} translation={node.translation} />
        </Suspense>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    textJson(id: { eq: $id }) {
      id
      section
      sectionName
      verses {
        text
        wordByWord
        translation
      }
    }
  }
`;

export default Section;