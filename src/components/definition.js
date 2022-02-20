import { Link } from 'gatsby';
import * as React from 'react';
import { useTransliterate } from '../components/transliterationHook';
import toUrl from '../util/util';


const Reference = ({ reference, refPartsOfSpeech, refStyle }) => {
    const refParts = reference.split("+");
    const translitRefParts = useTransliterate(reference).split("+");

    if (!reference) {
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
                refPartsOfSpeech
                    ?
                    (<>
                        [{refPartsOfSpeech} of {refLinks}]
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

const Definition = ({ definition, reference, refPartsOfSpeech }) => {
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
            <Reference reference={reference} refPartsOfSpeech={refPartsOfSpeech} refStyle={style} />
        </div>
    );
}


export default Definition;