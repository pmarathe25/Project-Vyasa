import React from "react";
import { transliterate } from "../util/transliterator";
import { SettingsContext } from "./settingsContext";

const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");
const iast = require("../../content/generated/transliteration_rulesets/iast.json");

export function useTransliterate(text) {
    const { translitMode, } = React.useContext(SettingsContext);

    const output = React.useMemo(() => {
        const translitRuleset = translitMode ? iast : devanagari;
        return transliterate(text, translitRuleset);
    }, [text, translitMode]);
    return output;
}