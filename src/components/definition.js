import { Link } from 'gatsby';
import * as React from 'react';
import { Container, Row } from 'react-bootstrap';
import allWordsDict from "../../content/generated/dictionary/all_words.json";
import { useTransliterate } from '../components/transliterationHook';
import { toDictUrl } from '../util/util';

const commonStyle = {
    padding: 0,
    width: "fit-content",
    color: "var(--text-secondary)",
    fontSize: "var(--tertiary-font-size)",
};


const Root = ({ root, partsOfSpeech }) => {
    const translitRootParts = useTransliterate(root).split("+");

    if (!root) {
        return (<></>);
    }

    let refLinks = [];
    const rootParts = root.split("+");
    for (let index in translitRootParts) {
        refLinks.push(
            <div lang="sa" style={{ marginLeft: "2px", display: "inline-block", ...commonStyle }} key={index}>
                {(index > 0 ? ", " : "")}
                <Link
                    to={toDictUrl(rootParts[index])}
                    style={{ fontSize: "var(--sanskrit-small-font-size)", fontStyle: "normal", whiteSpace: "nowrap" }}
                    key={index}
                >
                    {translitRootParts[index]}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ marginLeft: "4px", display: "inline-block", ...commonStyle }}>
            {
                partsOfSpeech
                    ?
                    (<>
                        [{partsOfSpeech} of {refLinks}]
                    </>
                    )
                    :
                    (
                        <>
                            [see {refLinks}]
                        </>
                    )
            }
        </div>
    )

}

const Definition = ({ word }) => {
    const [, definitions, roots, partsOfSpeeches] = React.useMemo(() => {
        return allWordsDict[word];
    }, [word]);

    let definitionElements = [];

    for (let index = 0; index < definitions.length; ++index) {
        const definition = definitions[index];
        const root = roots[index];
        const partsOfSpeech = partsOfSpeeches[index];

        definitionElements.push(
            <Row key={index}
                style={{
                    marginLeft: "5px",
                    marginRight: "0px",
                    ...commonStyle,
                }}>
                <p style={commonStyle}>
                    {definition}
                </p>
                <Root root={root} partsOfSpeech={partsOfSpeech} />
            </Row>
        );
    }

    return (
        <Container style={{
            // display: "inline-block",
            marginTop: "auto", marginBottom: "auto",
            padding: "0px",
            paddingLeft: "0px", paddingRight: "5px"
        }}>
            {definitionElements}
        </Container>
    );
}


export default Definition;