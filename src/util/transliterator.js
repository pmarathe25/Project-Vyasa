function transliterate(text, translitRuleset) {
    let sequenceMap = translitRuleset["sequence_map"];
    let rules = translitRuleset["rules"];

    text = text.toLowerCase();
    let output = "";
    let curDict = sequenceMap;
    let curSequence = "";
    for (let idx = 0; idx < text.length; ++idx) {
        let curChar = text[idx];
        let nextChar = text[idx + 1];

        if (curChar in curDict) {
            curDict = curDict[curChar]
            curSequence += curChar;
        }
        else {
            // Append unknown character as they are.
            output += curChar;
        }

        if (!(nextChar in curDict)) {
            if ("" in curDict) {
                output += curDict[""];
                curDict = sequenceMap;
            }
            else {
                // Unrecognized sequence, so append as-is
                output += curSequence;
            }
            curSequence = "";
        }
    }

    for (let rule_name in rules) {
        let rule_map = rules[rule_name];
        if (rule_name === "replace-sequence") {
            for (let inp_seq in rule_map) {
                let out_seq = rule_map[inp_seq];
                output = output.replace(new RegExp(inp_seq, "g"), out_seq);
            }
        }
    }

    return output;
}

module.exports = { transliterate };