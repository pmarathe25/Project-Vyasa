import json
import os
import subprocess as sp
import tempfile
from textwrap import dedent

import pytest

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir))
TRANSLITERATION_RULESET = os.path.join(ROOT_DIR, "content", "raw", "transliteration_rulesets", "devanagari.json")
DICTIONARY = os.path.join(ROOT_DIR, "content", "generated", "dictionary", "all_words.json")
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
        (["tata:", "aiva"], "tata aiva"),
        (["pr>s<t<a:", "abraviit"], "pr>s<t<au 'braviit"),
        (["tata:", "gam"], "tatau gam"),
        (["tata:", "na"], "tatau na"),
        (["pati:", "gam"], "patirgam"),
        (["ta:", "ca"], "tas~ca"),
        (["ta:", "cha"], "tas~cha"),
        (["taa:", "ca"], "taas~ca"),
        (["taa:", "cha"], "taas~cha"),
        (["ti:", "ca"], "tis~ca"),
        (["ti:", "cha"], "tis~cha"),
        (["ta:", "t<a"], "tas<t<a"),
        (["ta:", "ta"], "tasta"),
        # Vowels
        (["ca", "aiva"], "caaiva"),
        (["tathaa", "aiva"], "tathaaiva"),
        (["prabhai", "asmin"], "prabhai 'smin"),
        (["prabhai", "aadi"], "prabha aadi"),
        (["prabhaai", "asmin"], "prabhaa asmin"),
        (["prabhau", "asmin"], "prabhau 'smin"),
        (["prabhau", "aadi"], "prabha aadi"),
        (["prabhaau", "asmin"], "prabhaavasmin"),
        # Special 'm' rules
        (["naram", "ca"], "nara. ca"),
        # Special 'n' rules
        # NOTE: Doubling of 'n' only happens when preceded by a short vowel
        (["bhavan", "aika"], "bhavannaika"),
        (["bhavin", "aika"], "bhavinnaika"),
        (["bhavun", "aika"], "bhavunnaika"),
        # 'n' with long or compound vowels should not double
        (["bhavaan", "aika"], "bhavaanaika"),
        (["bhaviin", "aika"], "bhaviinaika"),
        (["bhavuun", "aika"], "bhavuunaika"),
        (["bhavain", "aika"], "bhavainaika"),
        (["bhavaain", "aika"], "bhavaainaika"),
        (["bhavaun", "aika"], "bhavaunaika"),
        (["bhavaaun", "aika"], "bhavaaunaika"),
        # Special 't' rules
        (["tat", "ca"], "tacca"),
        (["tat", "ja"], "tajja"),
        (["tat", "t<a"], "tat<t<a"),
        (["tat", "d<a"], "tad<d<a"),
        (["tat", "lauka"], "tallauka"),
        (["tat", "ma"], "tanma"),
        (["tat", "na"], "tanna"),
        # 't' plus sibilants
        (["tat", "sa"], "tatsa"),
        (["tat", "s<a"], "tats<a"),
        (["tat", "s~a"], "taccha"),
        # Consonant + Vowel
        (["naram", "aiva"], "naramaiva"),
        (["tam", "aas~ramam", "anupraaptam"], "tamaas~ramamanupraaptam"),
        (["naram", "r>s<i"], "naramr>s<i"),
        # Unvoiced + Voiced
        (["tat", "aiva"], "tadaiva"),
        (["tat", "gam"], "tadgam"),
        # Nasals
        (["tan", "ca"], "ta.s~ca"),
        (["tan", "cha"], "ta.s~cha"),
        (["tan", "t<a"], "ta.s<t<a"),
        (["tan", "ta"], "ta.sta"),
        # Vowel + Vowel
        (["tu", "iva"], "tviva"),
        (["tuu", "iva"], "tviva"),
        (["tu", "aiva"], "tvaiva"),
        (["ti", "upa"], "tyupa"),
        (["tii", "upa"], "tyupa"),
        (["ti", "aiva"], "tyaiva"),
        (["ti", "iva"], "tiiva"),
        (["taa", "api"], "taapi"),
        (["ta", "aapi"], "taapi"),
        (["taa", "aapi"], "taapi"),
        (["sarvai", "aiva"], "sarva aiva"),
        (["yatha", "r>tu"], "yathartu"),
        (["yathaa", "r>tu"], "yathartu"),
        (["yathaa", "r>taau", "r>tu"], "yathartaavr>tu"),
    ],
)
def test_build_sandhied_text(words, expected_output, transliteration_ruleset):
    assert build_sandhied_text(words, transliteration_ruleset) == expected_output


def build_expected(verse_num, verses_text, translations, word_lists):
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
    for (text, translation, word_list) in zip(verses_text, translations, word_lists):
        verses.append(
            {
                "num": verse_num,
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
            1

            ca (ca,) and
            aiva (aiva,) just so

            And so
            """,
            build_expected(
                "1",
                ["caaiva"],
                ["And so"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", ""],
                            ["aiva", "just so", "aiva", ""],
                        ]
                    ]
                ],
            ),
        ),
        # Alternate syntax omitting explicit root and parts of speech
        (
            """
            1

            ca and
            aiva just so

            And so
            """,
            build_expected(
                "1",
                ["caaiva"],
                ["And so"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", ""],
                            ["aiva", "just so", "aiva", ""],
                        ]
                    ]
                ],
            ),
        ),
        # Multi-line - no sandhi should happen
        (
            """
            1

            ca (ca,) and
            -
            aiva (aiva,) just so

            And so
            """,
            build_expected(
                "1",
                ["ca\naiva"],
                ["And so"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", ""],
                        ],
                        # Line 2
                        [
                            ["aiva", "just so", "aiva", ""],
                        ],
                    ]
                ],
            ),
        ),
        # Check parts of speech ordering
        (
            """
            1

            prastaavayan (pra-!stu, nom sing m pres act part caus) causing to start, starting

            Starting
            """,
            build_expected(
                "1",
                ["prastaavayan"],
                ["Starting"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            [
                                "prastaavayan",
                                "causing to start, starting",
                                "pra-√stu",
                                "Nominative Singular Masculine Present Active Causative Participle",
                            ],
                        ],
                    ]
                ],
            ),
        ),
        # Verb classes
        (
            """
            1

            ca (ca,) and
            aiva (aiva,) just so
            ks<ayati (!ks<i|VI, 3 sing pres act ind) it is destroyed

            And so it is destroyed
            """,
            build_expected(
                "1",
                ["caaiva ks<ayati"],
                ["And so it is destroyed"],
                [
                    # Verse 1
                    [
                        # Line 1
                        [
                            ["ca", "and", "ca", ""],
                            ["aiva", "just so", "aiva", ""],
                            [
                                "ks<ayati",
                                "it is destroyed",
                                "√ks<i (VI)",
                                "Third Person Singular Present Active Indicative",
                            ],
                        ]
                    ]
                ],
            ),
        ),
    ],
)
def test_process_text(content, expected_output):
    root_dir = tempfile.TemporaryDirectory()

    book_dir = os.path.join(root_dir.name, "01_example")
    os.makedirs(book_dir, exist_ok=True)

    chapter_file = os.path.join(book_dir, "01_example.txt")
    with open(chapter_file, "w") as inp:
        inp.write(dedent(content))

    expected_output["book"] = "Book 1: Example Parva"
    expected_output["chapter"] = "Chapter 1: Example Parva"

    out_file = os.path.join(root_dir.name, "processed.json")

    process_text = os.path.join(SCRIPTS_DIR, "process_text.py")

    cmd = ["python3", process_text, chapter_file, "-o", out_file, "-r", TRANSLITERATION_RULESET, "-d", DICTIONARY]
    print(f"Running command: {' '.join(cmd)}")
    status = sp.run(cmd)
    assert status.returncode == 0, f"Error in {process_text}"

    output = json.load(open(out_file))

    assert output == expected_output
