import json
import os
import pytest
import glob

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir))

TRANSLIT_RULESET = json.load(
    open(os.path.join(ROOT_DIR, "content", "generated", "transliteration_rulesets", "devanagari.json"))
)

# This is a direct port of the implementation in `src/util/transliterator.js`.
# Why duplicate the logic here? Because I can't bear to write tests in Javascript.
def transliterate(text):
    sequence_map = TRANSLIT_RULESET["sequence_map"]
    rules = TRANSLIT_RULESET["rules"]

    output = ""
    cur_dict = sequence_map
    cur_sequence = ""

    for idx in range(len(text)):
        cur_char = text[idx]
        next_char = text[idx + 1] if idx + 1 < len(text) else None

        if cur_char in cur_dict:
            cur_dict = cur_dict[cur_char]
            cur_sequence += cur_char
        else:
            # Append unknown characters as they are
            output += cur_char

        if next_char not in cur_dict:
            if "" in cur_dict:
                output += cur_dict[""]
                cur_dict = sequence_map
            else:
                # Unrecognized sequence, so append as-is
                output += cur_sequence
            cur_sequence = ""

    for rule_name in rules:
        rule_map = rules[rule_name]
        if rule_name == "replace-sequence":
            for inp_seq, out_seq in rule_map.items():
                output = output.replace(inp_seq, out_seq)

    return output


CONTENT_FILES = glob.glob(os.path.join(ROOT_DIR, "content", "generated", "text", "**", "*.json"), recursive=True)


def test_content_file_discovery():
    assert CONTENT_FILES


@pytest.mark.parametrize("content_file_path", CONTENT_FILES)
def test_correctness(content_file_path):
    content_filename = os.path.basename(content_file_path)

    if content_filename == "mahabharata_001_001.json":
        pytest.skip("No (digital) reference text available for this edition")

    reference_file = os.path.join(ROOT_DIR, "tests", "data", os.path.splitext(content_filename)[0] + ".txt")
    assert os.path.exists(reference_file), f"Please add a reference file for: {content_file_path}"
    reference_lines = open(reference_file, "r").readlines()

    content_lines = []
    content = json.load(open(content_file_path))
    for verse_data in content["verses"]:
        lines = transliterate(verse_data["text"])
        lines, _, _ = lines.partition("||")

        content_lines.extend(lines.split("|\n"))

    for content_line, reference_line in zip(content_lines, reference_lines):
        assert content_line.strip() == reference_line.strip()
