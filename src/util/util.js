
// Converts a string to a URL compatible format
function toUrl(str) {
    return str.replaceAll(" ", "-").toLowerCase();
}

export default toUrl;