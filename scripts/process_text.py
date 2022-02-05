#!/usr/bin/env python3
import argparse
import json
import os


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

    VOICED_MAKER_MAP = {
        unvoiced: voiced
        for unvoiced, voiced in zip(
            keys_of("unvoiced-consonants", "unvoiced-retroflex-consonants"),
            keys_of("voiced-consonants", "voiced-retroflex-consonants"),
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

    def replace_final(pat, replace_with):
        def replace_final_impl(cur, nxt):
            assert cur.endswith(pat)
            cur = cur[: -len(pat)] + replace_with
            return cur, nxt

        return replace_final_impl

    def matches(patterns, invert=False):
        def matches_impl(word, mode):
            if not word.strip():
                return False

            func = word.endswith if mode == "ends" else word.startswith
            for pat in patterns:
                if func(pat):
                    return not invert
            return invert

        return matches_impl

    VOWELS = keys_of("vowels")
    UNVOICED_CONSONANTS = keys_of("unvoiced-consonants", "unvoiced-retroflex-consonants")
    VOICED_CONSONANTS = keys_of("voiced-consonants", "voiced-retroflex-consonants")
    CONSONANTS = UNVOICED_CONSONANTS + VOICED_CONSONANTS + keys_of("nasal-consonants", "sibilants")
    SEMI_VOWELS = keys_of("semi-vowels")
    ALL_VOICED = VOICED_CONSONANTS + VOWELS + SEMI_VOWELS

    # Format: (first_word_condition, second_word_condition, change strategy)
    # Order matters because applying one sandhi may invalidate another!
    PRE_MERGE_SANDHI = [
        # Special rules for m
        (matches(["m"]), matches(VOWELS, invert=True), replace_final("m", ".")),
        # Special rules for t
        (matches(["t"]), matches(["c"]), replace_final("t", "c")),
        (matches(["t"]), matches(["j"]), replace_final("t", "j")),
        (matches(["t"]), matches(keys_of("unvoiced-retroflex-consonants")), make_retroflex),
        (matches(["t"]), matches(keys_of("voiced-retroflex-consonants")), compose(make_voiced, make_retroflex)),
        # Unvoiced -> Voiced
        (matches(UNVOICED_CONSONANTS), matches(ALL_VOICED), make_voiced),
    ]

    POST_MERGE_SANDHI = [
        # Visarga rules
        (matches(["aa:"]), matches(ALL_VOICED), replace_final("aa:", "aa")),
        (matches(["a:"]), matches(VOWELS), replace_final("a:", "a")),
        (matches(["a:"]), matches(ALL_VOICED), replace_final("a:", "au")),
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
        # Next we do a second pass to merge words
        MERGE_CONDITIONS = [
            (matches(VOWELS), matches(VOWELS)),
            (matches(CONSONANTS), matches(VOWELS)),
            (matches(CONSONANTS), matches(CONSONANTS)),
        ]
        merged = []
        index = 0
        while index < len(words):
            merged.append(words[index])
            for trailing_cond, leading_cond in MERGE_CONDITIONS:
                if trailing_cond(words[index], mode="ends") and leading_cond(words[index + 1], mode="starts"):
                    merged[-1] += words.pop(index + 1)
                    continue
            index += 1
        return merged

    words = apply_sandhi(words, PRE_MERGE_SANDHI)
    words = apply_merge(words)
    words = apply_sandhi(words, POST_MERGE_SANDHI)

    return " ".join(words).strip()


def get_mtime(path):
    return os.stat(path).st_mtime


def chunks(inp_iter, chunk_size):
    for idx in range(0, len(inp_iter), chunk_size):
        yield inp_iter[idx:chunk_size]


def parse_word_grammar(line):
    def strip(lst):
        return list(filter(lambda x: x, map(lambda x: x.strip(), lst)))

    # Note that we could use regex here, but manually parsing it is easy enough
    # and probably faster
    rest = line
    word, _, rest = rest.partition("(")
    root, _, rest = rest.partition(",")
    parts_of_speech, _, meaning = rest.partition(")")

    # Insert sqrt sign for verbal roots
    if "-" in root:
        last_dash = root.rfind("-") + 1
        root = root[:last_dash] + "√" + root[last_dash:]

    return strip([word, meaning, root, parts_of_speech])


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
    parser.add_argument("-o", "--output", help="Path to output JSON file in which to save the processed verse text")

    args, _ = parser.parse_known_args()

    # Early exit when nothing has been modified.
    if os.path.exists(args.output) and get_mtime(args.input_file) <= get_mtime(args.output):
        return

    book = extract_title(os.path.dirname(args.input_file))
    chapter = extract_title(os.path.splitext(os.path.basename(args.input_file))[0])
    processed = {
        "book": book,
        "chapter": chapter,
        "verses": [],
    }

    translit_ruleset = json.load(open(args.transliteration_ruleset))
    contents = open(args.input_file).read().strip().split("\n\n")

    # Parses input file according to format outlined in README.
    # To have the front-end handle newlines, we need a bit of weirdness in the word-by-word
    # translation - specifically, instead of just having a list of words for each verse, we have to have a list
    # of lines (i.e. list of lists). Then the front-end can render each list in a separate HTML element.
    for index, (word_by_word, translation) in enumerate(chunks(contents, 2)):
        word_by_word_sections = []
        word_lines = []
        for section in word_by_word.split("\n-\n"):
            word_by_word_sections.append([])
            word_lines.append([])
            for line in section.split("\n"):
                word, meaning, root, parts_of_speech = parse_word_grammar(line)
                word_lines[-1].append(word)
                word_by_word_sections[-1].append([word, meaning, root, parts_of_speech])

        processed["verses"].append(
            {
                "num": index,
                "text": "\n".join(build_sandhied_text(line, translit_ruleset) for line in word_lines),
                "translation": translation,
                "wordByWord": word_by_word_sections,
            }
        )

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    print("Writing to: {:}".format(args.output))
    json.dump(processed, open(args.output, "w"))


if __name__ == "__main__":
    main()
