import { Link } from 'gatsby';
import * as React from 'react';
import { useTransliterate } from '../components/transliterationHook';
import toUrl from '../util/util';


const Root = ({ root, partsOfSpeech, refStyle }) => {
    const refParts = root.split("+");
    const translitRefParts = useTransliterate(root).split("+");

    if (!root) {
        return (<></>);
    }

    let refLinks = [];
    for (let index in translitRefParts) {
        refLinks.push(
            <div style={refStyle} key={index}>
                {(index > 0 ? ", " : "")}
                <Link
                    to={`/dictionary#${toUrl(refParts[index])}`}
                    style={{ fontSize: "20px", fontStyle: "normal" }}
                    key={index}
                >
                    {translitRefParts[index]}
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

const Definition = ({ definition, root, partsOfSpeech }) => {
    const style = {
        color: "rgb(248, 248, 248)",
        display: "inline",
        fontStyle: "italic",
        top: "50%",
        width: "fit-content",
        padding: 0,
        marginLeft: "5px", marginTop: "auto", marginBottom: "auto",
        whiteSpace: "pre-wrap",
        fontSize: "15px"
    };

    return (
        <div style={style}>
            <p style={style}>
                {definition}
            </p>
            <Root root={root} partsOfSpeech={partsOfSpeech} refStyle={style} />
        </div>
    );
}


export default Definition;