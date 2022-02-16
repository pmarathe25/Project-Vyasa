import { Link } from 'gatsby';
import * as React from 'react';
import { useTransliterate } from '../components/transliterationHook';
import toUrl from '../util/util';


const Reference = ({ reference, refPartsOfSpeech, refStyle }) => {
    const translitReference = useTransliterate(reference);

    if (!reference) {
        return (<></>);
    }

    const refLink = (<Link to={`/dictionary#${toUrl(reference)}`} style={{ fontSize: "18px" }}>
        {translitReference}
    </Link>);

    return (
        <div style={refStyle}>
            {
                refPartsOfSpeech
                    ?
                    (<>
                        [{refPartsOfSpeech} of {refLink}]
                    </>
                    )
                    :
                    (
                        <>
                            [see {refLink}]
                        </>
                    )
            }
        </div>
    )

}

const Definition = ({ definition, reference, refPartsOfSpeech }) => {
    const style = {
        color: "rgb(220, 220, 220)",
        display: "inline",
        top: "50%",
        width: "fit-content",
        padding: 0,
        marginLeft: "5px", marginTop: "auto", marginBottom: "auto",
        whiteSpace: "pre-wrap",
        fontSize: "16px"
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