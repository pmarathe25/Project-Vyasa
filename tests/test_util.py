import json
import os

import pytest

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir))
DICTIONARY = json.load(open(os.path.join(ROOT_DIR, "content", "generated", "dictionary", "all_words.json")))
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")

import sys

sys.path.insert(0, SCRIPTS_DIR)

from util import process_parts_of_speech


def lookup(*words):
    return [DICTIONARY[word.replace("!", "√")] for word in words]


@pytest.mark.parametrize(
    "parts,is_verb,is_declined,dictionary_entries,expected",
    [
        ("nom sing m", False, True, lookup("vacana", "sa.panna"), "Nominative Singular Masculine"),
    ],
)
def test_process_parts_of_speech(parts, is_verb, is_declined, dictionary_entries, expected):
    assert expected == process_parts_of_speech(
        parts, is_verb, err_prefix="", is_declined=is_declined, dictionary_entries=dictionary_entries
    )


@pytest.mark.parametrize(
    "parts,is_verb,is_declined,dictionary_entries,expected_err",
    [
        # Missing gender on adjective
        ("nom sing", False, True, lookup("vacana", "sa.panna"), "Expected parts of speech:"),
        # Missing gender on participle
        ("acc pl pres mid part", True, True, lookup("sukha", "!aas"), "Expected parts of speech:"),
    ],
)
def test_process_parts_of_speech_negative(parts, is_verb, is_declined, dictionary_entries, expected_err):
    with pytest.raises(Exception, match=expected_err):
        process_parts_of_speech(
            parts, is_verb, err_prefix="", is_declined=is_declined, dictionary_entries=dictionary_entries
        )
