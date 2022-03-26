import React from "react";
import { transliterate } from "../util/transliterator";
import { TranslitModeContext } from "./translitModeSelect";

const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");
const iast = require("../../content/generated/transliteration_rulesets/iast.json");

export function useTransliterate(text) {
    const { mode, } = React.useContext(TranslitModeContext);

    const output = React.useMemo(() => {
        const translitRuleset = mode ? iast : devanagari;
        return transliterate(text, translitRuleset);
    }, [text, mode]);
    return output;
}