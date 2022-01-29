import pytest
import tempfile
import json
import subprocess as sp

import os

SCRIPTS_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir, "scripts"))


@pytest.mark.parametrize(
    "sequence_map,expected_trie",
    [
        # 1-layer trie
        (
            {
                "sequence_map": {
                    "vowels": {"a": "="},
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {"": "="},
                },
                "vowels": ["="],
                "rules": {},
            },
        ),
        # 1-layer multi-set trie
        (
            {
                "sequence_map": {
                    "vowels": {"a": "="},
                    "consonants": {"b": "-"},
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {"": "="},
                    "b": {"": "-"},
                },
                "vowels": ["="],
                "consonants": ["-"],
                "rules": {},
            },
        ),
        # 1-layer multi-element trie
        (
            {
                "sequence_map": {
                    "vowels": {
                        "a": "=",
                        "e": "-",
                    },
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {"": "="},
                    "e": {"": "-"},
                },
                "vowels": ["=", "-"],
                "rules": {},
            },
        ),
        # 2-layer trie
        (
            {
                "sequence_map": {
                    "vowels": {
                        "a": "=",
                        "aa": "+",
                    },
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {
                        "": "=",
                        "a": {"": "+"},
                    },
                },
                "vowels": ["=", "+"],
                "rules": {},
            },
        ),
        # 2-layer branching trie
        (
            {
                "sequence_map": {
                    "vowels": {
                        "a": "=",
                        "aa": "+",
                        "ab": "-",
                    },
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {
                        "": "=",
                        "a": {"": "+"},
                        "b": {"": "-"},
                    },
                },
                "vowels": ["=", "+", "-"],
                "rules": {},
            },
        ),
        # 2-layer branching multi-element trie
        (
            {
                "sequence_map": {
                    "vowels": {
                        "a": "=",
                        "aa": "+",
                        "ab": "-",
                        "ea": ";",
                    },
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {
                        "": "=",
                        "a": {"": "+"},
                        "b": {"": "-"},
                    },
                    "e": {
                        "a": {"": ";"},
                    },
                },
                "vowels": ["=", "+", "-", ";"],
                "rules": {},
            },
        ),
        # 3-layer branching trie
        (
            {
                "sequence_map": {
                    "vowels": {
                        "a": "=",
                        "aa": "+",
                        "aba": "/",
                        "aab": ";",
                        "aac": ",",
                    },
                },
                "rules": {},
            },
            {
                "sequence_map": {
                    "a": {
                        "": "=",
                        "a": {
                            "": "+",
                            "b": {"": ";"},
                            "c": {"": ","},
                        },
                        "b": {
                            "a": {"": "/"},
                        },
                    },
                },
                "vowels": ["=", "+", "/", ";", ","],
                "rules": {},
            },
        ),
    ],
)
def test_build_trie(sequence_map, expected_trie):
    inp = tempfile.NamedTemporaryFile("w+", suffix=".json")
    json.dump(sequence_map, inp)
    inp.flush()

    out_dir = tempfile.TemporaryDirectory()
    out_file = os.path.join(out_dir.name, "trie.json")

    build_trie = os.path.join(SCRIPTS_DIR, "build_trie.py")

    cmd = ["python3", build_trie, inp.name, "-o", out_file]
    print(f"Running command: {' '.join(cmd)}")
    status = sp.run(cmd)
    assert status.returncode == 0, f"Error in {build_trie}"

    trie = json.load(open(out_file))

    assert trie == expected_trie
