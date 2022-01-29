
// Converts a string to a URL compatible format
function toUrl(str) {
    return str.replace(" ", "-").toLowerCase();
}

export default toUrl;