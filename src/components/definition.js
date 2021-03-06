import { Link } from 'gatsby';
import * as React from 'react';
import { Container } from 'react-bootstrap';
import allWordsDict from "../../content/generated/dictionary/all_words.json";
import { useTransliterate } from '../components/transliterationHook';
import { toDictUrl } from '../util/util';

const commonStyle = {
    color: "var(--text-secondary)",
    padding: 0,
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
            <div lang="sa" style={{ marginLeft: "4px", display: "inline-block", ...commonStyle }} key={index}>
                {(index > 0 ? ", " : "")}
                <Link
                    to={toDictUrl(rootParts[index])}
                    style={{ fontSize: "var(--secondary-font-size)", fontStyle: "normal", whiteSpace: "nowrap" }}
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

const Definition = ({ word, makeDefinitionLink = false, marginLeft = "5px" }) => {
    const [, definitions, roots, partsOfSpeeches] = React.useMemo(() => {
        return allWordsDict[word];
    }, [word]);

    let definitionElements = [];

    for (let index = 0; index < definitions.length; ++index) {
        const definition = definitions[index];
        const root = roots[index];
        const partsOfSpeech = partsOfSpeeches[index];

        definitionElements.push(
            <div key={index}
                style={{
                    width: "100%", marginLeft: marginLeft,
                    display: "inline-block",
                    ...commonStyle
                }}>
                {
                    makeDefinitionLink
                        ?
                        <Link to={toDictUrl(word)} style={{ textDecoration: "none", cursor: "pointer" }}>
                            {definition}
                        </Link>
                        :
                        <>
                            {definition}
                        </>
                }
                <Root root={root} partsOfSpeech={partsOfSpeech} />
            </div>
        );
    }

    return (
        <Container style={{
            marginTop: "auto", marginBottom: "auto",
            padding: "0px",
            paddingLeft: "0px", paddingRight: "5px"
        }}>
            {definitionElements}
        </Container>
    );
}


export default Definition;