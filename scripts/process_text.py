#!/usr/bin/env python3
import argparse
import json
import os


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

    return strip([word, meaning, root, parts_of_speech])


def extract_title(str):
    return str.split("_")[1].title() + " Parva"


def main():
    parser = argparse.ArgumentParser(
        description="Processes raw verse-text files into JSON files that can be queried by the front-end"
    )
    parser.add_argument(
        "input_file",
        help="Path to the input text file. Path format: <book_num>_<book_title>/<chapter_num>_<chapter_title>.txt",
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

    contents = open(args.input_file).read().split("\n\n")
    for index, (verse_text, word_by_word, translation) in enumerate(chunks(contents, 3)):
        word_by_word_sections = word_by_word.split("\n-\n")
        processed["verses"].append(
            {
                "num": index,
                "text": verse_text,
                "translation": translation,
                "wordByWord": [list(map(parse_word_grammar, section.split("\n"))) for section in word_by_word_sections],
            }
        )

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    print("Writing to: {:}".format(args.output))
    json.dump(processed, open(args.output, "w"))


if __name__ == "__main__":
    main()
