import React from "react";
import { transliterate } from "../util/transliterator";
import { SettingsContext, DEVANAGARI_MODE } from "./settingsPanel";

const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");
const iast = require("../../content/generated/transliteration_rulesets/iast.json");

export function useTransliterate(text) {
    const { translitMode, } = React.useContext(SettingsContext);

    const output = React.useMemo(() => {
        const translitRuleset = translitMode === DEVANAGARI_MODE ? devanagari : iast;
        return transliterate(text, translitRuleset);
    }, [text, translitMode]);
    return output;
}