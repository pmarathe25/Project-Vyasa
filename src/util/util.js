import { transliterate } from "./transliterator";

const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");


// Converts a string to a URL compatible format
export function toUrl(str) {
    return str
        .replaceAll(": ", "-")
        .replaceAll(" ", "-")
        .replaceAll("√", "rt")
        .replaceAll("<", "lt")
        .replaceAll(">", "gt")
        .replaceAll("(", "lparen")
        .replaceAll(")", "rparen")
        .toLowerCase();
}

// Converts a string converted by `toUrl` to title case
export function titleCaseFromUrl(str) {
    let titleCase = [];
    for (let substr of str.split("-")) {
        for (let word of substr.split("_")) {
            titleCase.push(word.charAt(0).toUpperCase() + word.slice(1)
                // HACK: Insert colons in breadcrumbs between book/chapter numbers and titles.
                + (!isNaN(word) ? ":" : "")
            );
        }
    }
    return titleCase.join(" ");
}

export function sortSanskrit(word, otherWord) {
    return transliterate(word[0].replace("√", ""), devanagari) > transliterate(otherWord[0].replace("√", ""), devanagari) ? 1 : -1;
}

export default toUrl;