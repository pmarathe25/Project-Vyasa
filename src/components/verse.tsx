import { Link } from 'gatsby';
import * as React from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import useIsMobile, { getWindowWidth } from '../util/responsiveness';
import { toDictUrl } from '../util/util';
import Definition from './definition';
import { SettingsContext } from './settingsPanel';
import { useTransliterate } from './transliterationHook';
import { clickableText, verseText } from './verse.module.css';

interface RootMeaningsProps {
  root: string;
}

const RootMeanings = React.memo(function RootMeanings({ root }: RootMeaningsProps) {
  const roots = root.split('+');
  const translitRoots = useTransliterate(root).split('+');

  return (
    <>
      {translitRoots.map((rootPar, index) => (
        <div key={index} style={{ display: 'flex' }}>
          <Link to={toDictUrl(roots[index])} target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: 'var(--sanskrit-font-size)',
              whiteSpace: 'nowrap',
              height: 'fit-content',
              textDecorationThickness: '1px',
            }}
          >
            {rootPar}
          </Link>
          <Definition word={roots[index]} />
        </div>
      ))}
    </>
  );
});

interface WordWithPopoverProps {
  word: string;
  definition: string;
  root: string;
  parts_of_speech: string;
}

const WordWithPopover = ({ word, definition, root, parts_of_speech }: WordWithPopoverProps) => {
  const translitWord = useTransliterate(word);
  const [showPopover, setShowPopover] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);

  const ref = React.useRef<HTMLParagraphElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Detect clicks outside the word and popover to make the popover go away on mobile.
  React.useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      const outsideWord = ref.current && !ref.current.contains(event.target as Node);
      const outsidePopover = !popoverRef.current || (popoverRef.current && !popoverRef.current.contains(event.target as Node));

      if (outsideWord && outsidePopover) {
        setShowPopover(false);
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('touchstart', handleClick, true);
    document.addEventListener('touchmove', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('touchstart', handleClick, true);
      document.removeEventListener('touchmove', handleClick, true);
    };
  }, []);

  // Update window width on mount and resize (for SSR safety)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(getWindowWidth());
      const handleResize = () => setWindowWidth(getWindowWidth());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (!definition && !root && !parts_of_speech) {
    return (
      <p style={{ padding: '0px', margin: '0px', width: 'fit-content', fontSize: 'var(--sanskrit-font-size)' }}>
        {translitWord}
      </p>
    );
  }

  const maxPopoverWidth = `${Math.min(windowWidth - 50, 500)}px`;

  return (
    <Col style={{ padding: '0px', marginLeft: '5px', marginRight: '5px', width: 'fit-content' }}>
      <OverlayTrigger
        placement="top"
        show={showPopover}
        overlay={
          <Popover
            id={`${word}-popover`}
            style={{ backgroundColor: 'var(--accent-color)', maxWidth: maxPopoverWidth }}
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            onTouchStart={() => setShowPopover(true)}
            onTouchMove={() => setShowPopover(false)}
            show={showPopover}
          >
            <Popover.Body ref={popoverRef} id={`${word}-popover-body`} style={{ paddingTop: '7px', paddingBottom: '7px', paddingLeft: '8px', paddingRight: '8px' }}>
              <Col>
                <RootMeanings root={root} />
                <p style={{
                  width: 'fit-content',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontSize: 'var(--tertiary-font-size)',
                  marginTop: '5px',
                  paddingTop: '1px',
                  borderTop: '1px solid var(--highlight-color)',
                  fontWeight: 'var(--bold-font-weight)',
                }}>
                  {parts_of_speech}
                </p>
              </Col>
            </Popover.Body>
          </Popover>
        }
      >
        <p
          lang="sa"
          ref={ref}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={showPopover}
          aria-describedby={showPopover ? `${word}-popover-body` : undefined}
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          onTouchStart={() => setShowPopover(true)}
          onTouchMove={() => setShowPopover(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowPopover(true);
            }
            if (e.key === 'Escape') {
              setShowPopover(false);
            }
          }}
          style={{
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'var(--highlight-color)',
            color: 'var(--text-alternate)',
            borderRadius: '2px',
          }}
        >
          {translitWord}
        </p>
      </OverlayTrigger>

      <p style={{
        fontSize: 'var(--tertiary-font-size)',
        color: 'var(--text-tertiary)',
        width: 'fit-content',
        maxWidth: '110px',
        textAlign: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: '8px',
      }}>
        {definition}
      </p>
    </Col>
  );
};

interface WordByWordProps {
  wordByWord: Array<Array<[string, string, string, string]>>;
}

const WordByWord = ({ wordByWord }: WordByWordProps) => {
  return (
    <>
      {wordByWord.map((line, index) => (
        <Row
          key={index}
          style={{
            fontSize: 'var(--sanskrit-font-size)',
            whiteSpace: 'pre-wrap',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          lg="auto"
        >
          {line.map(([word, definition, root, parts_of_speech], wordIndex) => (
            <WordWithPopover
              key={index + wordIndex}
              word={word}
              definition={definition}
              root={root}
              parts_of_speech={parts_of_speech}
            />
          ))}
        </Row>
      ))}
    </>
  );
};

interface VerseProps {
  text: string;
  wordByWord: Array<Array<[string, string, string, string]>>;
  translation: string;
}

const Verse = ({ text, wordByWord, translation }: VerseProps) => {
  const translitText = useTransliterate(text);
  const isMobile = useIsMobile();
  const [showWordByWord, setShowWordByWord] = React.useState(false);
  const { state } = React.useContext(SettingsContext);
  const { showTranslation } = state;

  const colStyle = {
    paddingLeft: '0px',
    paddingRight: '0px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: showTranslation ? '0px' : '15px',
    marginBottom: '8px',
  };

  const verseTextComp = (
    <Col style={colStyle}>
      {showWordByWord ? (
        <>
          <WordByWord wordByWord={wordByWord} />
          <p
            role="button"
            tabIndex={0}
            onClick={() => setShowWordByWord(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowWordByWord(false);
              }
            }}
            className={clickableText}
            style={{
              fontSize: 'var(--tertiary-font-size)',
              width: 'fit-content',
              marginTop: '15px',
              marginBottom: '5px',
            }}
          >
            Show Original Text
          </p>
        </>
      ) : (
        <p
          lang="sa"
          role="button"
          tabIndex={0}
          className={verseText}
          style={{
            fontSize: 'var(--sanskrit-font-size)',
            paddingBottom: '2px',
            whiteSpace: 'pre-wrap',
          }}
          onClick={() => setShowWordByWord(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowWordByWord(true);
            }
          }}
        >
          {translitText}
        </p>
      )}
    </Col>
  );

  if (!showTranslation) {
    return verseTextComp;
  }

  return (
    <Row className={isMobile ? 'row-cols-1' : 'row-cols-2'} style={{
      marginTop: '15px',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderBottom: isMobile ? '1px solid var(--border-color)' : '',
    }}>
      {verseTextComp}
      <Col style={{
        ...colStyle,
        fontSize: 'var(--secondary-font-size)',
        color: 'var(--text-tertiary)',
      }}>
        {translation}
      </Col>
    </Row>
  );
};

export default Verse;