import argparse
import glob
import json
import os

import util


def validate_dictionary(dct):
    for word, (_, reference, _) in dct.items():
        if reference and reference not in dct:
            raise RuntimeError(
                "Word: {:} refers to: {:}, but the latter is not present as an entry in the dictionary!".format(
                    word, reference
                )
            )


def main():
    parser = argparse.ArgumentParser(description="Builds a dictionary JSON file based on a group of input text files")
    parser.add_argument("base_dir", help="The base directory containning the input text files")
    parser.add_argument("-o", "--output", help="Path to write the output JSON file")

    args, _ = parser.parse_known_args()

    out_dict = json.load(open(args.output)) if os.path.exists(args.output) else {}
    for path in sorted(glob.iglob(os.path.join(args.base_dir, "*.txt"))):
        if (
            os.path.exists(args.output)
            and util.get_mtime(args.output) > util.get_mtime(path)
            # Skip nothing if the script has changed
            and util.get_mtime(__file__) < util.get_mtime(path)
        ):
            continue

        print("Processing: {:}".format(path))

        with open(path, "r") as f:
            for line_num, line in enumerate(f.readlines()):

                def add(word, meanings):
                    nonlocal out_dict
                    meanings, _, reference = meanings.partition("[")
                    reference = reference.strip().strip("]")
                    reference, _, reference_parts_of_speech = reference.partition(",")
                    out_dict[word.strip()] = list(
                        map(
                            lambda x: x.strip(),
                            [
                                meanings,
                                reference,
                                util.process_parts_of_speech(
                                    reference_parts_of_speech,
                                    is_verb="√" in reference,
                                    err_prefix="In file: {:} on line: {:}: ".format(path, line_num),
                                    is_declined=False,
                                ),
                            ],
                        )
                    )

                if not line:
                    continue

                line = line.replace("!", "√")
                tokens = [x for x in line.split(" ") if x]
                if "√" in tokens[0]:
                    word, _, meanings = line.partition(" ")
                    add(word, meanings)
                elif "(" in tokens[1]:
                    word, _, rest = line.partition("(")
                    detail, _, meanings = rest.partition(")")
                    if detail == "indc":
                        detail = "indeclinable"
                    elif detail == "adj":
                        detail += "."
                    else:
                        detail = "./".join(detail) + "."
                    add(word, "({:}) {:}".format(detail, meanings))
                else:
                    word, _, meanings = line.partition(" ")
                    add(word, meanings)

    validate_dictionary(out_dict)
    print("Writing dictionary to: {:}".format(args.output))
    json.dump(out_dict, open(args.output, "w"), separators=(",", ":"))


if __name__ == "__main__":
    main()
