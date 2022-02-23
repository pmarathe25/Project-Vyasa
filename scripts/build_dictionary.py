"""
Processes dictionary files to create a single file containing all entries. 
The format of the dictionary is: Dict[str, Tuple[str, str, str, str]]
That is, it maps words to tuples of (meanings, reference/root, parts of speech of reference/root, section name)
The section name indicates which section of the dictionary the word should be rendered under.

Additionally, this also sorts lines in the original file.
"""
import argparse
import glob
import json
import os

import util


def validate_dictionary(dct):
    for word, (_, reference, _, section_name) in dct.items():
        is_verb = "√" in word

        assert not reference or all(
            ref_part if not is_verb else util.adjust_verb(ref_part) in dct for ref_part in reference.split("+")
        ), f"Word: {word} refers to: {reference}, but the latter is not present in the dictionary!"

        assert word.strip("√").startswith(section_name), f"Word: {word} is in the wrong section: {section_name}"

        if is_verb:
            base_form = word.split("-")[-1]
            assert base_form in dct, "Base form ({:}) of word: {:} is not present in the dictionary!".format(
                base_form, word
            )


def main():
    parser = argparse.ArgumentParser(description="Builds a dictionary JSON file based on a group of input text files")
    parser.add_argument("base_dir", help="The base directory containning the input text files")
    parser.add_argument("-o", "--output", help="Path to write the output JSON file")
    parser.add_argument(
        "-r",
        "--transliteration-ruleset",
        required=True,
        help="Path to the raw transliteration ruleset, used to apply sandhi.",
    )

    args, _ = parser.parse_known_args()

    TRANSLIT_RULESET = json.load(open(args.transliteration_ruleset))

    SECTION_NAMES = []
    for letter_set in TRANSLIT_RULESET["sequence_map"].values():
        SECTION_NAMES.extend(letter_set.keys())
    # Sort in order of descdending length
    SECTION_NAMES = sorted(SECTION_NAMES, key=lambda x: len(x), reverse=True)

    out_dict = json.load(open(args.output)) if os.path.exists(args.output) else {}
    for path in sorted(glob.iglob(os.path.join(args.base_dir, "*.txt"))):
        if (
            os.path.exists(args.output)
            and util.get_mtime(args.output) > util.get_mtime(path)
            # Skip nothing if the script has changed
            and util.get_mtime(__file__) < util.get_mtime(path)
        ):
            continue

        print(f"Processing: {path}")

        expected_start_letter, _ = os.path.splitext(os.path.basename(path))
        # Delete any previous entries from this file so that removing an entry
        # from the text file also removes it from the dictionary.
        rem_words = list(filter(lambda word: word.strip("√").startswith(expected_start_letter), out_dict.keys()))
        for word in rem_words:
            del out_dict[word]

        POSSIBLE_SECTION_NAMES = [
            section_name for section_name in SECTION_NAMES if section_name.startswith(expected_start_letter)
        ]

        with open(path, "r") as f:
            sorted_lines = list(map(lambda x: x.strip(), sorted(f.readlines())))
            for line_num, line in enumerate(sorted_lines):

                def add(word, meanings):
                    base_word = word.strip("√")
                    if not base_word.startswith(expected_start_letter):
                        raise RuntimeError(
                            f"In file: {path} on line: {line_num}: Expected word to start with: {expected_start_letter}"
                            f"\nNote: Word was: {word}"
                        )

                    section_name = None
                    for candidate_section in POSSIBLE_SECTION_NAMES:
                        if base_word.startswith(candidate_section):
                            section_name = candidate_section
                            break
                    else:
                        raise RuntimeError(
                            f"In file: {path} on line: {line_num}: Could not determine section name."
                            f"\nNote: Word was: {word}, candidate section names were: {POSSIBLE_SECTION_NAMES}"
                        )

                    nonlocal out_dict
                    meanings, _, reference = meanings.partition("[")
                    reference = reference.strip().strip("]")
                    reference, _, reference_parts_of_speech = reference.partition(",")
                    is_reference_verb = "!" in reference
                    if is_reference_verb:
                        reference = util.adjust_verb(reference)
                    out_dict[word.strip()] = list(
                        map(
                            lambda x: x.strip(),
                            [
                                meanings,
                                reference,
                                util.process_parts_of_speech(
                                    reference_parts_of_speech,
                                    is_verb=is_reference_verb,
                                    err_prefix=f"In file: {path} on line: {line_num}: ",
                                    is_declined=False,
                                ),
                                section_name,
                            ],
                        )
                    )

                if not line:
                    continue

                tokens = [x for x in line.split(" ") if x]
                if "!" in tokens[0]:
                    word, _, meanings = line.partition(" ")
                    add(util.adjust_verb(word), meanings)
                elif "(" in tokens[1]:

                    word, _, rest = line.partition("(")

                    detail, _, meanings = rest.partition(")")
                    if detail == "indc":
                        detail = "indeclinable"
                    elif detail == "adj":
                        detail += "."
                    elif detail:
                        if not all(elem in "mfn" for elem in detail):
                            raise RuntimeError(
                                "Unrecognized item in word details: '{:}'\nNote: Line was: {:}"
                                "\nHint: If no details (e.g. gender) are required, use an empty set of "
                                "parentheses to separate the word from its definition".format(detail, line)
                            )
                        detail = "./".join(detail) + "."
                    add(word, (f"({detail}) " if detail else "") + f"{meanings}")
                else:
                    word, _, meanings = line.partition(" ")
                    add(word, meanings)

        print("\tSorting: {:}".format(path))
        with open(path, "w") as f:
            f.write("\n".join(sorted_lines))

    validate_dictionary(out_dict)
    print(f"Writing dictionary to: {args.output}")
    json.dump(out_dict, open(args.output, "w"), separators=(",", ":"))


if __name__ == "__main__":
    main()
