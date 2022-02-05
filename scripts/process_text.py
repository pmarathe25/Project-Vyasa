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
    sequence_map = translit_ruleset["sequence_map"]

    def is_vowel(letter):
        return letter in sequence_map["vowels"]

    def is_consonant(letter):
        return letter in sequence_map["consonants"]

    merged = []
    index = 0
    while index < len(words):
        cur = words[index]
        # Use a dummy "word" to avoid edge case handling
        next = words[index + 1] if index + 1 < len(words) else "  "

        def merge(cur, next):
            nonlocal index
            merged.append(cur + next)
            index += 1

        if is_vowel(cur[-1]) and is_vowel(next[0]):
            merge(cur, next)
        elif is_consonant(cur[-1]) and is_vowel(next[0]):
            merge(cur, next)
        else:
            merged.append(cur)
        index += 1

    return " ".join(merged).strip()


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
