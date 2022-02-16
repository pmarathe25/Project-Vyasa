import { transliterate } from "./transliterator";

const devanagari = require("../../content/generated/transliteration_rulesets/devanagari.json");


// Converts a string to a URL compatible format
export function toUrl(str) {
    return str.replaceAll(" ", "-").replaceAll("√", "rt").replaceAll("<", "lt").toLowerCase();
}

// Converts a string converted by `toUrl` to title case
export function titleCaseFromUrl(str) {
    let titleCase = [];
    for (let substr of str.split("-")) {
        for (let word of substr.split("_")) {
            titleCase.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
    }
    return titleCase.join(" ");
}

export function sortSanskrit(word, otherWord) {
    // For the purposes of sorting, it doesn't matter how we transliterate.
    return transliterate(word.replace("√", ""), devanagari) > transliterate(otherWord.replace("√", ""), devanagari) ? 1 : -1;
}

export default toUrl;