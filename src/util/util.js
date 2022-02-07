// Converts a string to a URL compatible format
export function toUrl(str) {
    return str.replaceAll(" ", "-").toLowerCase();
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

export default toUrl;