#!/usr/bin/env python3
import argparse
import json
import os


def get_mtime(path):
    return os.stat(path).st_mtime


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

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    print("Writing to: {:}".format(args.output))
    # json.dump({}, open(args.output, "w"))


if __name__ == "__main__":
    main()
