import allWordsDict from "../../content/generated/dictionary/all_words.json";
import devanagari from "../../content/generated/transliteration_rulesets/devanagari.json";
import { transliterate } from "./transliterator";

// Converts a string to a URL compatible format
export function toUrl(str) {
    return str
        .replaceAll(": ", "-")
        .replaceAll(" ", "-")
        .replaceAll(".", "-")
        .replaceAll("√", "rt")
        .replaceAll("<", "lt")
        .replaceAll(">", "gt")
        .replaceAll("(", "lparen")
        .replaceAll(")", "rparen")
        .toLowerCase();
}

// Generates the dictionary URL for a given word
export function toDictUrl(word) {
    return `/dictionary/${allWordsDict[word][[0]]}#${toUrl(word)}`;
}

function isNumber(obj) {
    return obj && !isNaN(obj);
}

// Converts a string converted by `toUrl` to title case
export function titleCaseFromUrl(str) {
    let titleCase = [];

    // Special case for Home
    if (str === "/") {
        return "Home";
    }

    const str_parts = str.split("-");

    // Special case for purely numerical titles, which should be joined by a '-' instead of a space.
    if (str_parts.every(isNumber)) {
        return str_parts.join("-")
    }

    for (let substr of str_parts) {
        for (let word of substr.split("_")) {
            titleCase.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
    }
    return titleCase.join(" ");
}

export function sortSanskrit(word, otherWord) {
    return transliterate(word.replace("√", ""), devanagari) > transliterate(otherWord.replace("√", ""), devanagari) ? 1 : -1;
}

export default toUrl;