import argparse
import json
import glob
import os


def get_mtime(path):
    return os.stat(path).st_mtime


def main():
    parser = argparse.ArgumentParser(description="Builds a dictionary JSON file based on a group of input text files")
    parser.add_argument("base_dir", help="The base directory containning the input text files")
    parser.add_argument("-o", "--output", help="Path to write the output JSON file")

    args, _ = parser.parse_known_args()

    out_dict = {}
    for path in glob.iglob(os.path.join(args.base_dir, "*.txt")):
        if os.path.exists(args.output) and get_mtime(args.output) > get_mtime(path):
            continue

        with open(path, "r") as f:
            for line in filter(lambda x: x, f.readlines()):
                word, _, meanings = line.partition(" ")
                if "-" in word:
                    last_dash = word.rfind("-") + 1
                    word = word[:last_dash] + "√" + word[last_dash:]
                out_dict[word] = meanings

    json.dump(out_dict, open(args.output, "w"))


if __name__ == "__main__":
    main()
