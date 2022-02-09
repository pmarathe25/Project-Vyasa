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

    out_dict = json.load(open(args.output)) if os.path.exists(args.output) else {}
    for path in sorted(glob.iglob(os.path.join(args.base_dir, "*.txt"))):
        if (
            os.path.exists(args.output)
            and get_mtime(args.output) > get_mtime(path)
            # Skip nothing if the script has changed
            and get_mtime(__file__) < get_mtime(path)
        ):
            continue

        print("Processing: {:}".format(path))

        def add(word, meanings):
            nonlocal out_dict
            out_dict[word.strip()] = meanings.strip()

        def handle_verb(line):
            word, _, meanings = line.partition(" ")
            word = word.replace("!", "√")
            add(word, meanings)

        def handle_nominal(line):
            word, _, rest = line.partition("(")
            detail, _, meanings = rest.partition(")")
            if detail == "indc":
                detail = "indeclinable"
            else:
                detail += "."
            add(word, "({:}) {:}".format(detail, meanings))

        with open(path, "r") as f:
            for line_num, line in enumerate(f.readlines()):
                if not line:
                    continue
                tokens = [x for x in line.split(" ") if x]
                if "!" in tokens[0]:
                    handle_verb(line)
                elif "(" in tokens[1]:
                    handle_nominal(line)
                else:
                    raise RuntimeError(
                        "Error on line: {:} in: {:}. Did you forget to mark a verb root or include "
                        "additional information about a noun/adj/indeclinable?"
                        "\nNote: Line was: {:}".format(line_num, path, line)
                    )

    print("Writing dictionary to: {:}".format(args.output))
    json.dump(out_dict, open(args.output, "w"))


if __name__ == "__main__":
    main()
