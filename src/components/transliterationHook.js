import React from "react";
import { TranslitModeContext } from "./translitModeSelect";
import { transliterate } from "../util/transliterator";


export function useTransliterate(text) {
    const { mode, } = React.useContext(TranslitModeContext);
    const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");
    const iast = require("../../content/generated/transliteration_rulesets/iast.json");
    const translitRuleset = mode ? iast : devanagari;

    return transliterate(text, translitRuleset);
}