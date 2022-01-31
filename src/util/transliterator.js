function transliterate(text, translitRuleset) {
    let sequence_map = translitRuleset["sequence_map"];
    let rules = translitRuleset["rules"];

    text = text.toLowerCase();
    let output = "";
    let cur_dict = sequence_map;
    for (let idx = 0; idx < text.length; ++idx) {
        let cur_char = text[idx];
        let next_char = text[idx + 1];

        if (cur_char in cur_dict) {
            cur_dict = cur_dict[cur_char]
        }
        else {
            // Append unknown character as they are.
            output += cur_char;
        }

        if (!(next_char in cur_dict) && "" in cur_dict) {
            output += cur_dict[""];
            cur_dict = sequence_map;
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