import json
import os
import subprocess as sp
import tempfile
from textwrap import dedent

import pytest

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir))
TRANSLITERATION_RULESET = os.path.join(ROOT_DIR, "content", "raw", "transliteration_rulesets", "devanagari.json")
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")

import sys

sys.path.insert(0, SCRIPTS_DIR)

from process_text import build_sandhied_text


@pytest.fixture(scope="session")
def transliteration_ruleset():
    return json.load(open(TRANSLITERATION_RULESET))


@pytest.mark.parametrize(
    "words,expected_output",
    [
        # Visarga
        (
            ["tata:", "aiva"],
            "tata aiva",
        ),
        (
            ["tata:", "gam"],
            "tatau gam",
        ),
        (
            ["pati:", "gam"],
            "patirgam",
        ),
        # Vowels
        (
            ["ca", "aiva"],
            "caaiva",
        ),
        # Special 'm' rules
        (
            ["naram", "ca"],
            "nara. ca",
        ),
        # Special 't' rules
        (
            ["tat", "ca"],
            "tacca",
        ),
        (
            ["tat", "ja"],
            "tajja",
        ),
        (
            ["tat", "t<a"],
            "tat<t<a",
        ),
        (
            ["tat", "d<a"],
            "tad<d<a",
        ),
        # Consonant + Vowel
        (
            ["naram", "aiva"],
            "naramaiva",
        ),
        # Unvoiced + Voiced
        (
            ["tat", "aiva"],
            "tadaiva",
        ),
        (
            ["tat", "gam"],
            "tadgam",
        ),
    ],
)
def test_build_sandhied_text(words, expected_output, transliteration_ruleset):
    assert build_sandhied_text(words, transliteration_ruleset) == expected_output


def build_expected(verses_text, translations, word_lists):
    """
    Args:
        verses_text (List[str]):
                The expected text for each verse.
        translations (List[str]):
                The expected translation for each verse.
        word_lists (List[List[List[List[str]]]]):
                A list of verses lists where each verse list is a list of
                lines where each line is a list of tuples
                containing (word, meaning, root, parts_of_speech).
                For example:
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            [word0, meaning0, root0, parts_of_speech0],
                            [word1, meaning1, root1, parts_of_speech1],
                            ...
                        ]
                        # Line 2
                        ...
                    ]
                    # Verse 2
                    ...
                ]
    """
    verses = []
    for index, (text, translation, word_list) in enumerate(zip(verses_text, translations, word_lists)):
        verses.append(
            {
                "num": index + 1,
                "text": text,
                "translation": translation,
                "wordByWord": word_list,
            }
        )

    return {"verses": verses}


@pytest.mark.parametrize(
    "content,expected_output",
    [
        # Basic
        (
            """
            Verse 1-1

            ca (ca, indc) and
            aiva (aiva, indc) just so

            And so
            """,
            build_expected(
                ["caaiva"],
                ["And so"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", "Indeclinable"],
                            ["aiva", "just so", "aiva", "Indeclinable"],
                        ]
                    ]
                ],
            ),
        ),
        # Multi-line - no sandhi should happen
        (
            """
            Verse 1-1

            ca (ca, indc) and
            -
            aiva (aiva, indc) just so

            And so
            """,
            build_expected(
                ["ca\naiva"],
                ["And so"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", "Indeclinable"],
                        ],
                        # Line 2
                        [
                            ["aiva", "just so", "aiva", "Indeclinable"],
                        ],
                    ]
                ],
            ),
        ),
    ],
)
def test_process_text(content, expected_output):
    in_dir = tempfile.TemporaryDirectory(suffix="_example")
    with tempfile.NamedTemporaryFile("w+", dir=in_dir.name, suffix="_example.txt") as inp:
        inp.write(dedent(content))
        inp.flush()

        expected_output["book"] = "Example Parva"
        expected_output["chapter"] = "Example Parva"

        out_dir = tempfile.TemporaryDirectory()
        out_file = os.path.join(out_dir.name, "processed.json")

        process_text = os.path.join(SCRIPTS_DIR, "process_text.py")

        cmd = ["python3", process_text, inp.name, "-o", out_file, "-r", TRANSLITERATION_RULESET]
        print(f"Running command: {' '.join(cmd)}")
        status = sp.run(cmd)
        assert status.returncode == 0, f"Error in {process_text}"

        output = json.load(open(out_file))

        assert output == expected_output
