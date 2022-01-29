
function transliterate(text, trie) {
    let sequence_map = trie["sequence_map"];
    let rules = trie["rules"];

    let output = "";
    let cur_dict = sequence_map;
    let cur_sequence = ""; // For debugging purposes
    for (let ch of text) {
        cur_sequence += ch;
        if (ch in cur_dict) {
            cur_dict = cur_dict[ch]
        }
        else if ("" in cur_dict) {
            cur_sequence = "";
            output += cur_dict[""];
            cur_dict = sequence_map[ch];
        }
        else {
            throw new Error("Sequence not found in trie: " + cur_sequence);
        }
    }
    // Special handling for last letter
    if ("" in cur_dict) {
        output += cur_dict[""];
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