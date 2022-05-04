import { Link } from 'gatsby';
import * as React from 'react';
import { Container } from 'react-bootstrap';
import { useTransliterate } from '../components/transliterationHook';
import toUrl from '../util/util';

const style = {
    color: "var(--text-gray-color)",
    padding: 0,
    fontSize: "14.5px",
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
            <div style={{ marginLeft: "4px", display: "inline-block", ...style }} key={index}>
                {(index > 0 ? ", " : "")}
                <Link
                    to={`/dictionary#${toUrl(rootParts[index])}`}
                    style={{ fontSize: "19px", fontStyle: "normal", whiteSpace: "nowrap" }}
                    key={index}
                >
                    {translitRootParts[index]}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ marginLeft: "4px", display: "inline-block", ...style }}>
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

const Definition = ({ definitions, roots, partsOfSpeeches }) => {
    let definitionElements = [];

    for (let index = 0; index < definitions.length; ++index) {
        const definition = definitions[index];
        const root = roots[index];
        const partsOfSpeech = partsOfSpeeches[index];

        definitionElements.push(
            <div key={index}
                style={{
                    width: "100%", marginLeft: "5px",
                    display: "inline-block",
                    ...style
                }}>
                {definition}
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