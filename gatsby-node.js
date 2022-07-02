const allWordsDict = require("./content/generated/dictionary/all_words.json")

exports.createPages = async function ({ actions }) {
    let sectionNames = new Set();
    for (let word in allWordsDict) {
        const [sectionName] = allWordsDict[word];
        sectionNames.add(sectionName);
    }

    for (const sectionName of sectionNames) {
        actions.createPage({
            path: `/dictionary/${sectionName}`,
            component: require.resolve(`./src/templates/dictionarySection.js`),
            context: { sectionName: `${sectionName}` },
        })
    }
}