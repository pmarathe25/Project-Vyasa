#!/usr/bin/env python3
import argparse
import json
import os
from collections import OrderedDict

import util


def build_sandhied_text(words, translit_ruleset):
    """
    Generates sandhied text from a list of words.

    Args:
        words (List[str]):
                A list of words using Project Vyasa's special transliteration format.
        translit_ruleset (JSON):
                The raw transliteration ruleset to use to determine how sandhi should be applied.
                The ruleset should distinguish letters as vowels, consonants, compound vowels, etc.

    Returns:
        str: The sandhied text.
    """
    SEQUENCE_MAP = translit_ruleset["sequence_map"]

    def keys_of(*cat_names):
        keys = []
        for cat_name in cat_names:
            keys.extend(SEQUENCE_MAP[cat_name].keys())
        return keys

    VOWELS = keys_of("vowels")
    UNVOICED_CONSONANTS = keys_of(
        "unvoiced-velar-consonants",
        "unvoiced-palatal-consonants",
        "unvoiced-retroflex-consonants",
        "unvoiced-dental-consonants",
        "unvoiced-bilabial-consonants",
    )
    VOICED_CONSONANTS = keys_of(
        "voiced-velar-consonants",
        "voiced-palatal-consonants",
        "voiced-retroflex-consonants",
        "voiced-dental-consonants",
        "voiced-bilabial-consonants",
    )
    NASAL_CONSONANTS = keys_of(
        "nasal-velar-consonants",
        "nasal-palatal-consonants",
        "nasal-retroflex-consonants",
        "nasal-dental-consonants",
        "nasal-bilabial-consonants",
    )
    SEMI_VOWELS = keys_of(
        "velar-semivowels",
        "palatal-semivowels",
        "retroflex-semivowels",
        "dental-semivowels",
        "bilabial-semivowels",
    )

    CONSONANTS = UNVOICED_CONSONANTS + VOICED_CONSONANTS + NASAL_CONSONANTS + keys_of("sibilants")
    ALL_VOICED = VOICED_CONSONANTS + VOWELS + SEMI_VOWELS + NASAL_CONSONANTS

    VOICED_MAKER_MAP = {
        unvoiced: voiced
        for unvoiced, voiced in zip(
            UNVOICED_CONSONANTS,
            VOICED_CONSONANTS,
        )
    }

    def compose(*funcs):
        def new_func(cur, nxt):
            for func in funcs:
                cur, nxt = func(cur, nxt)
            return cur, nxt

        return new_func

    def make_voiced(cur, nxt):
        for unvoiced, voiced in VOICED_MAKER_MAP.items():
            if cur.endswith(unvoiced):
                cur = cur[: -len(unvoiced)] + voiced
                return cur, nxt
        return cur, nxt

    def make_retroflex(cur, nxt):
        return cur + "<", nxt

    def replace(mode, replace_pairs):
        """
        Args:
            replace_pairs (List[Tuple[str, str]]):
                    A list of tuples containing the substring to replace
                    and what to replace it with. These are processed in order
                    and only the first matching replacement is applied.
        """

        def replace_impl(cur, nxt):
            for pat, replace_with in replace_pairs:
                if mode == "end":
                    if cur.endswith(pat):
                        cur = cur[: -len(pat)] + replace_with
                        return cur, nxt
                else:
                    assert mode == "start", f"Mode must be either 'start' or 'end', but was: {mode}"
                    if nxt.startswith(pat):
                        nxt = replace_with + nxt[len(pat) :]
                        return cur, nxt
            return cur, nxt

        return replace_impl

    def matches(patterns, invert=False, but_not=None):
        """
        Builds a function that will match a particular pattern in a word.

        Args:
            patterns (List[str]):
                    A list of patterns to match
            invert (bool):
                    Whether to invert the check, i.e. check if the patterns do *not* match.
            but_not (List[str]):
                    A list of strings that should disqualify a match when present.
                    For example, to match a visarga that is not preceded by `a`
                    use `matches([":"], but_not=["a:"])`.
        """
        but_not = but_not or []

        def matches_impl(word, mode):
            if not word.strip():
                return False

            func = word.endswith if mode == "ends" else word.startswith
            for pat in patterns:
                if func(pat) and not any(func(exc_pat) for exc_pat in but_not):
                    return not invert
            return invert

        return matches_impl

    # Format: (first_word_condition, second_word_condition, change strategy)
    # Order matters because applying one sandhi may invalidate another!
    PRE_MERGE_SANDHI = [
        # Special rules for m
        (matches(["m"]), matches(VOWELS, invert=True), replace("end", [("m", ".")])),
        # Special rules for t
        (matches(["t"]), matches(keys_of("dental-semivowels")), replace("end", [("t", "l")])),
        (matches(["t"]), matches(["c"]), replace("end", [("t", "c")])),
        (matches(["t"]), matches(["j"]), replace("end", [("t", "j")])),
        (matches(["t"]), matches(keys_of("unvoiced-retroflex-consonants")), make_retroflex),
        (matches(["t"]), matches(keys_of("voiced-retroflex-consonants")), compose(make_voiced, make_retroflex)),
        # Unvoiced -> Voiced
        (matches(UNVOICED_CONSONANTS), matches(ALL_VOICED), make_voiced),
        # Visarga sandhi
        (matches([":"], but_not=["a:", "aa:"]), matches(ALL_VOICED), replace("end", [(":", "r")])),
        (matches([":"]), matches(keys_of("unvoiced-palatal-consonants")), replace("end", [(":", "s~")])),
        (matches([":"]), matches(keys_of("unvoiced-retroflex-consonants")), replace("end", [(":", "s<")])),
        (matches([":"]), matches(keys_of("unvoiced-dental-consonants")), replace("end", [(":", "s")])),
        # Nasals
        (matches(["n"]), matches(keys_of("unvoiced-palatal-consonants")), replace("end", [("n", ".s~")])),
        (matches(["n"]), matches(keys_of("unvoiced-retroflex-consonants")), replace("end", [("n", ".s<")])),
        (matches(["n"]), matches(keys_of("unvoiced-dental-consonants")), replace("end", [("n", ".s")])),
        # Vowels + Vowels
        (matches(["u"]), matches(VOWELS, but_not=["u"]), replace("end", [("uu", "v"), ("u", "v")])),
        (matches(["i"]), matches(VOWELS, but_not=["i"]), replace("end", [("ii", "y"), ("i", "y")])),
        (
            matches(["a", "aa"]),
            matches(["a", "aa"], but_not=["au", "aau"]),
            compose(
                replace("end", [("aa", "a")]),
                replace("start", [("aa", "a")]),
            ),
        ),
    ]

    # Next we do a second pass to merge words
    MERGE_CONDITIONS = [
        (matches(VOWELS), matches(VOWELS)),
        (matches(CONSONANTS + SEMI_VOWELS), matches(VOWELS + CONSONANTS + SEMI_VOWELS)),
    ]

    # And finally, a pass to apply sandhi that we don't want to merge
    POST_MERGE_SANDHI = [
        # Visarga rules
        (matches(["aa:"]), matches(ALL_VOICED), replace("end", [("aa:", "aa")])),
        (
            matches(["a:"]),
            matches(["a"], but_not=["aa", "au", "ai"]),
            compose(
                replace("end", [("a:", "au")]),
                replace("start", [("a", "'")]),
            ),
        ),
        (matches(["a:"]), matches(VOWELS), replace("end", [("a:", "a")])),
        (matches(["a:"]), matches(ALL_VOICED), replace("end", [("a:", "au")])),
    ]

    def apply_sandhi(words, conditions):
        index = 0
        # Use a dummy "word" to avoid edge case handling
        words += ["  "]
        while index < len(words):
            for trailing_cond, leading_cond, strat in conditions:
                if trailing_cond(words[index], mode="ends") and leading_cond(words[index + 1], mode="starts"):
                    words[index], words[index + 1] = strat(words[index], words[index + 1])
            index += 1
        return words

    def apply_merge(words):
        merged = [words.pop(0)]
        index = 0
        while words:
            for trailing_cond, leading_cond in MERGE_CONDITIONS:
                if trailing_cond(merged[index], mode="ends") and leading_cond(words[0], mode="starts"):
                    merged[-1] += words.pop(0)
                    break
            else:
                merged.append(words.pop(0))
                index += 1
        return merged

    words = apply_sandhi(words, PRE_MERGE_SANDHI)
    words = apply_merge(words)
    words = apply_sandhi(words, POST_MERGE_SANDHI)

    return " ".join(words).strip()


def parse_word_grammar(line, verse_num, line_num, dictionary):
    def strip(lst):
        return list(map(lambda x: x.strip(), lst))

    def check(elem, elem_name):
        if not elem:
            raise RuntimeError(
                f"In verse: {verse_num}, line: {line_num}, expected a '{elem_name}' field but none was provided"
            )

    # Note that we could use regex here, but manually parsing it is easy enough
    # and probably faster
    rest = line
    parts_of_speech = ""
    if "(" in rest:
        word, _, rest = rest.partition("(")

        if "," not in rest:
            raise RuntimeError(
                f"In verse: {verse_num}, line: {line_num}, expected a comma separating the root from parts of speech!"
            )

        root, _, rest = rest.partition(",")
        parts_of_speech, _, meaning = rest.partition(")")

        check(word, "word")
        check(root, "root")
        check(meaning, "meaning")
    else:
        # Alternate format when word == root and no parts of speech are needed.
        word, _, meaning = rest.partition(" ")
        root = word

    # Insert sqrt sign for verbal roots
    is_verb = "!" in root
    if is_verb:
        root = root.replace("!", "√")

    dictionary_entries = []
    for root_part in root.split("+"):
        if root_part not in dictionary:
            raise RuntimeError(f"Could not find: {root_part} in the dictionary. Is an entry missing?")
        dictionary_entries.append(dictionary[root_part])

    return strip(
        [
            word,
            meaning,
            root,
            util.process_parts_of_speech(
                parts_of_speech,
                is_verb,
                f"In verse: {verse_num}, line: {line_num} ({line}): ",
                dictionary_entries=dictionary_entries,
            ),
        ]
    )


def extract_title(str):
    return str.split("_")[-1].title() + " Parva"


def main():
    parser = argparse.ArgumentParser(
        description="Processes raw verse-text files into JSON files that can be queried by the front-end"
    )
    parser.add_argument(
        "input_file",
        help="Path to the input text file. Path format: <book_num>_<book_title>/<chapter_num>_<chapter_title>.txt",
    )
    parser.add_argument(
        "-r",
        "--transliteration-ruleset",
        required=True,
        help="Path to the raw transliteration ruleset, used to apply sandhi.",
    )
    parser.add_argument(
        "-d",
        "--dictionary",
        required=True,
        help="Path to the dictionary, used to check that all words have definitions.",
    )

    parser.add_argument("-o", "--output", help="Path to output JSON file in which to save the processed verse text")

    args, _ = parser.parse_known_args()

    # Early exit when nothing has been modified.
    if (
        os.path.exists(args.output)
        and util.get_mtime(args.input_file) <= util.get_mtime(args.output)
        # Skip nothing if the script has changed
        and util.get_mtime(__file__) < util.get_mtime(args.output)
    ):
        return

    TRANSLIT_RULESET = json.load(open(args.transliteration_ruleset))
    DICTIONARY = json.load(open(args.dictionary))

    book = extract_title(os.path.dirname(args.input_file))
    chapter = extract_title(os.path.splitext(os.path.basename(args.input_file))[0])
    processed = {
        "book": book,
        "chapter": chapter,
        "verses": [],
    }

    contents = open(args.input_file).read().strip()

    # Strip trailing whitespace at the ends of lines
    contents = "\n".join(map(lambda x: x.strip(), contents.splitlines()))

    # Parses input file according to format outlined in README.
    # To have the front-end handle newlines, we need a bit of weirdness in the word-by-word
    # translation - specifically, instead of just having a list of words for each verse, we have to have a list
    # of lines (i.e. list of lists). Then the front-end can render each list in a separate HTML element.
    for verse_num, word_by_word, translation in util.chunks(contents.split("\n\n"), 3):
        word_by_word_sections = []
        to_sandhi_word_lines = []
        for section in word_by_word.split("\n-\n"):
            word_by_word_sections.append([])
            to_sandhi_word_lines.append([])
            for line_num, line in enumerate(section.split("\n")):
                word, meaning, root, parts_of_speech = parse_word_grammar(line, verse_num, line_num + 1, DICTIONARY)
                to_sandhi_word_lines[-1].append(word)
                word_by_word_sections[-1].append([word, meaning, root, parts_of_speech])

        processed["verses"].append(
            {
                "num": verse_num,
                "text": "\n".join(build_sandhied_text(line, TRANSLIT_RULESET) for line in to_sandhi_word_lines),
                "translation": translation,
                "wordByWord": word_by_word_sections,
            }
        )

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    print(f"Writing to: {args.output}")
    json.dump(processed, open(args.output, "w"), separators=(",", ":"))


if __name__ == "__main__":
    main()
