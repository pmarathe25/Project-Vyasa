#!/usr/bin/env python3
import argparse
import glob
import json
import os
from collections import defaultdict

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

    VOWELS = keys_of("short-vowels", "long-vowels", "compound-vowels", "vocalic")
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

    CONSONANTS = (
        UNVOICED_CONSONANTS + VOICED_CONSONANTS + NASAL_CONSONANTS + keys_of("sibilants") + keys_of("approximants")
    )
    ALL_VOICED = VOICED_CONSONANTS + VOWELS + SEMI_VOWELS + NASAL_CONSONANTS + keys_of("approximants")
    ALL = CONSONANTS + VOWELS + SEMI_VOWELS

    VOICED_MAKER_MAP = {
        unvoiced: voiced
        for unvoiced, voiced in zip(
            UNVOICED_CONSONANTS,
            VOICED_CONSONANTS,
        )
    }

    def postpend(patterns, str):
        return [pat + str for pat in patterns]

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

    def join():
        """
        Joins two words together into one.
        """

        def join_impl(cur, nxt):
            # We join the first word into the second so that sandhi can continue correctly.
            # Otherwise, the next iteration would see "" as the first word.
            return "", cur + nxt

        return join_impl

    def matches(patterns=None, but_not=None):
        """
        Builds a function that will match a particular pattern in a word.

        Args:
            patterns (List[str]):
                    A list of patterns to match.
                    By default, matches everything.
            but_not (List[str]):
                    A list of strings that should disqualify a match when present.
                    For example, to match a visarga that is not preceded by `a`
                    use `matches([":"], but_not=["a:"])`.
        """
        patterns = patterns or [""]
        but_not = but_not or []

        def matches_impl(word, mode):
            func = word.endswith if mode == "ends" else word.startswith

            # Split patterns by length. but_not only applies if it is the same length or longer than the pattern.
            len_pattern_map = defaultdict(list)
            len_but_not_map = defaultdict(list)
            for pat in patterns:
                len_pattern_map[len(pat)].append(pat)
            for exc_pat in but_not:
                len_but_not_map[len(exc_pat)].append(exc_pat)

            # Descending length so that we catch non-matching patterns correctly
            all_lens = list(len_pattern_map.keys()) + list(len_but_not_map.keys())
            for length in sorted(all_lens, reverse=True):
                pat_list = len_pattern_map[length]
                but_not_list = len_but_not_map[length]

                if any(func(exc_pat) for exc_pat in but_not_list):
                    return False
                if any(func(pat) for pat in pat_list):
                    return True
            return False

        return matches_impl

    # Format: (first_word_condition, second_word_condition, change strategy)
    # Order matters because applying one sandhi may invalidate another; it's a classic phase-ordering problem!
    PRE_MERGE_SANDHI = [
        # Special rules for m
        (matches(["m"]), matches(ALL, but_not=VOWELS), replace("end", [("m", ".")])),
        # Special rules for t
        (matches(["t"]), matches(keys_of("dental-semivowels")), replace("end", [("t", "l")])),
        (
            matches(["t"]),
            matches(keys_of("nasal-dental-consonants", "nasal-bilabial-consonants")),
            replace("end", [("t", "n")]),
        ),
        (matches(["t"]), matches(["c"]), replace("end", [("t", "c")])),
        (
            matches(["t"]),
            matches(["s~"]),
            compose(
                replace("end", [("t", "c")]),
                replace("start", [("s~", "ch")]),
            ),
        ),
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
        # Final 'n' is doubled when preceded by a short vowel and followed by any vowel.
        (
            matches(
                postpend(keys_of("short-vowels"), "n"),
                but_not=postpend(keys_of("long-vowels", "compound-vowels"), "n"),
            ),
            matches(VOWELS),
            replace("end", [("n", "nn")]),
        ),
        # Vowels + Vowels
        (
            matches(["u", "aau"], but_not=["au"]),
            matches(VOWELS, but_not=["u"]),
            replace("end", [("uu", "v"), ("u", "v")]),
        ),
        (
            matches(["i"], but_not=["ai", "aai"]),
            matches(VOWELS, but_not=["i"]),
            replace("end", [("ii", "y"), ("i", "y")]),
        ),
        (
            matches(["a", "aa"]),
            matches(["a", "aa"]),
            compose(
                replace("end", [("aa", "a")]),
                replace("start", [("aa", "a")]),
            ),
        ),
        (
            matches(["ai", "au"], but_not=["aai", "aau"]),
            matches(["a"], but_not=["aa", "ai", "au"]),
            replace("start", [("a", "'")]),
        ),
        (
            matches(["a", "aa"]),
            matches(["r>"]),
            compose(
                replace("end", [("aa", "a")]),
                replace("start", [("r>", "r")]),
                join(),
            ),
        ),
    ]

    # Next we do a second pass to merge words
    MERGE_CONDITIONS = [
        (matches(VOWELS, but_not=["ai", "aai", "au", "aau"]), matches(VOWELS)),
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
        # Vowel rules
        (matches(["aai"]), matches(VOWELS), replace("end", [("aai", "aa")])),
        (matches(["ai"]), matches(VOWELS, but_not=["a"]), replace("end", [("ai", "a")])),
        (matches(["au"], but_not=["aau"]), matches(VOWELS, but_not=["a"]), replace("end", [("au", "a")])),
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
    if is_str_end_marker(line):
        return [line, None, None, None]

    def strip(lst):
        return list(map(lambda x: x.strip(), lst))

    def check(elem, elem_name):
        if not elem:
            raise RuntimeError(
                f"In verse: {verse_num}, line: {line_num}, expected a '{elem_name}' field but none was provided."
                f"\nNote: Line was: {line}"
            )

    # Note that we could use regex here, but manually parsing it is easy enough
    # and probably faster
    rest = line
    parts_of_speech = ""
    if "(" in rest:
        word, _, rest = rest.partition("(")

        if "," not in rest:
            root, _, meaning = rest.partition(")")
            if root not in dictionary or any("(indeclinable)" not in entry for entry in dictionary[root][1]):
                raise RuntimeError(
                    f"In verse: {verse_num}, line: {line_num}, expected a comma separating the root from parts of speech!"
                    "Parts of speech may only be omitted for indeclinables!"
                    f"\nNote: Line was: {line}"
                )
        else:
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
        root = util.adjust_verb(root)

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


def is_str_verse_end_marker(inp):
    return inp.startswith("||")


def is_str_end_marker(inp):
    return is_str_verse_end_marker(inp) or inp == "|"


def process_files(input_path, output_path, transliteration_ruleset, dictionary):
    # Early exit when nothing has been modified.
    if (
        os.path.exists(output_path)
        and util.get_mtime(input_path) <= util.get_mtime(output_path)
        # Skip nothing if the script has changed
        and util.get_mtime(__file__) < util.get_mtime(output_path)
    ):
        return

    TRANSLIT_RULESET = json.load(open(transliteration_ruleset))
    DICTIONARY = json.load(open(dictionary))

    dirname = os.path.dirname(input_path)
    work_path = os.path.realpath(os.path.join(dirname, os.path.pardir))
    work = os.path.basename(work_path).title()

    def extract_num(part):
        return str(int(part.split("_")[0]))

    section = "-".join(
        extract_num(path_component) for path_component in os.path.split(os.path.relpath(input_path, work_path))
    )

    processed = {
        "work": work,
        "group": section.split(".")[0],
        "section": section,
        "verses": [],
    }

    contents = open(input_path).read().strip()

    # Strip trailing whitespace at the ends of lines
    contents = "\n".join(map(lambda x: x.strip(), contents.splitlines()))

    # Parses input file according to format outlined in CONTRIBUTING.md.
    # To have the front-end handle newlines, we need a bit of weirdness in the word-by-word translation - specifically,
    # instead of just having a list of words for each verse, we have to have a list of lines of words (i.e. list of lists of words).
    # Then the front-end can render each list in a separate HTML element.
    verse_num = 0
    for word_by_word, translation in util.chunks(contents.split("\n\n"), 2):
        word_by_word_sections = [[]]
        to_sandhi_word_lines = [[]]

        for line_num, line in enumerate(word_by_word.splitlines()):
            if is_str_verse_end_marker(line):
                line += f" {verse_num} ||"
                verse_num += 1

            word, meaning, root, parts_of_speech = parse_word_grammar(line, verse_num, line_num, DICTIONARY)
            to_sandhi_word_lines[-1].append(word)
            word_by_word_sections[-1].append([word, meaning, root, parts_of_speech])

            if is_str_end_marker(line):
                word_by_word_sections.append([])
                to_sandhi_word_lines.append([])

        # Remove the final empty section
        word_by_word_sections.pop()
        to_sandhi_word_lines.pop()

        processed["verses"].append(
            {
                "text": "\n".join(build_sandhied_text(line, TRANSLIT_RULESET) for line in to_sandhi_word_lines),
                "translation": translation,
                "wordByWord": word_by_word_sections,
            }
        )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    print(f"Writing to: {output_path}")
    json.dump(processed, open(output_path, "w"), separators=(",\n", ":"))


def main():
    parser = argparse.ArgumentParser(
        description="Processes raw verse-text files into JSON files that can be queried by the front-end"
    )
    parser.add_argument(
        "input_dir",
        help="Path to the directory containing all the raw content files..",
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

    parser.add_argument("-o", "--output", help="Path to output directory in which to save the processed content files")

    args, _ = parser.parse_known_args()

    for path in glob.iglob(os.path.join(args.input_dir, "**", "*.txt"), recursive=True):
        output_path = "_".join(os.path.relpath(path, args.input_dir).split(os.path.sep))
        output_path = os.path.splitext(output_path)[0] + ".json"
        output_path = os.path.join(args.output, output_path)
        process_files(path, output_path, args.transliteration_ruleset, args.dictionary)


if __name__ == "__main__":
    main()
