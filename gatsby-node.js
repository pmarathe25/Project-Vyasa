const allWordsDict = require("./content/generated/dictionary/all_words.json")

const sectionWordsMap = {};
for (const [word, entry] of Object.entries(allWordsDict)) {
  const [sectionName] = entry;
  if (!sectionWordsMap[sectionName]) {
    sectionWordsMap[sectionName] = [];
  }
  sectionWordsMap[sectionName].push(word);
}

const sectionNames = Object.keys(sectionWordsMap);

exports.createPages = async function ({ actions }) {
    for (const sectionName of sectionNames) {
        actions.createPage({
            path: `/dictionary/${sectionName}`,
            component: require.resolve(`./src/templates/dictionarySection.tsx`),
            context: { 
              sectionName: `${sectionName}`,
              words: sectionWordsMap[sectionName],
            },
        })
    }
}