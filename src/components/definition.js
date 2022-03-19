import { Link } from 'gatsby';
import * as React from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTransliterate } from '../components/transliterationHook';
import toUrl from '../util/util';

const Root = ({ root, partsOfSpeech, refStyle }) => {
    const rootParts = root.split("+");
    const translitRootParts = useTransliterate(root).split("+");

    if (!root) {
        return (<></>);
    }

    let refLinks = [];
    for (let index in translitRootParts) {
        refLinks.push(
            <div style={refStyle} key={index}>
                {(index > 0 ? ", " : "")}
                <Link
                    to={`/dictionary#${toUrl(rootParts[index])}`}
                    style={{ fontSize: "20px", fontStyle: "normal", whiteSpace: "nowrap" }}
                    key={index}
                >
                    {translitRootParts[index]}
                </Link>
            </div>
        );
    }

    return (
        <div style={refStyle}>
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
    const style = {
        color: "rgb(250, 250, 250)",
        display: "inline-block",
        fontStyle: "italic",
        padding: 0,
        fontSize: "15px",
    };

    let definitionElements = [];

    for (let index = 0; index < definitions.length; ++index) {
        const definition = definitions[index];
        const root = roots[index];
        const partsOfSpeech = partsOfSpeeches[index];

        definitionElements.push(
            <Row style={{ width: "100%", marginLeft: "5px" }}>
                <div style={style} key={definition}>
                    <p style={style}>
                        {definition}
                    </p>
                    <Root root={root} partsOfSpeech={partsOfSpeech} refStyle={{ marginLeft: "4px", ...style }} />
                </div>
            </Row>
        );
    }

    return (
        <Container style={{ height: "fit-content", marginTop: "auto", marginBottom: "auto", padding: "0px", paddingLeft: "0px" }}>
            {definitionElements}
        </Container>
    );
}


export default Definition;