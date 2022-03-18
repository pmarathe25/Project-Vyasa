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
from typing import List, Tuple

import util


def validate_dictionary(dct):
    for word, (section_name, _, references, _) in dct.items():
        is_verb = "√" in word
        if is_verb:
            base_form = word.split("-")[-1]
            assert base_form in dct, "Base form ({:}) of word: {:} is not present in the dictionary!".format(
                base_form, word
            )

        for reference in references:
            assert not reference or all(
                (ref_part if not is_verb else util.adjust_verb(ref_part)) in dct for ref_part in reference.split("+")
            ), f"Word: {word} refers to: {reference}, but the latter is not present in the dictionary!"

            assert word.strip("√").startswith(section_name), f"Word: {word} is in the wrong section: {section_name}"


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
                line_num += 1

                def add(word: str, definitions: List[Tuple[str, bool]]):
                    """
                    Add a word and one or more definitions to the dictionary.

                    Args:
                        word (str): The word to add to the dictionary.
                        definitions (List[Tuple[str, bool]]):
                                A list of definitions and booleans indicating whether they are adjectives.
                    """
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

                    # Create an entry including definitions, references, and reference parts of speech.
                    dict_entry = [section_name, [], [], []]
                    for definition, is_adj in definitions:
                        definition, _, reference = definition.partition("[")
                        reference = reference.strip().strip("]")
                        reference, _, reference_parts_of_speech = reference.partition(",")

                        is_reference_verb = "!" in reference
                        if is_reference_verb:
                            reference = util.adjust_verb(reference)

                        # If the referrent is an adjective, we need to change certain forms - e.g. "des" -> "desadj"
                        if is_adj:
                            reference_parts_of_speech = reference_parts_of_speech.replace("des", "desadj")

                        dict_entry[1].append(definition.strip())
                        dict_entry[2].append(reference.strip())
                        dict_entry[3].append(
                            util.process_parts_of_speech(
                                reference_parts_of_speech,
                                is_verb=is_reference_verb,
                                err_prefix=f"In file: {path} on line: {line_num}: ",
                                is_declined=False,
                                is_adj=is_adj,
                            ).strip()
                        )
                    out_dict[word.strip()] = dict_entry

                if not line:
                    continue

                def process_detail(detail):
                    is_adj = False
                    if detail == "indc":
                        detail = "indeclinable"
                    elif detail == "adj":
                        is_adj = True
                        detail += "."
                    elif detail:
                        if not all(elem in "mfn" for elem in detail):
                            raise RuntimeError(
                                "Unrecognized item in word details: '{:}'\nNote: Line was: {:}"
                                "\nHint: If no details (e.g. gender) are required, use an empty set of "
                                "parentheses to separate the word from its definition".format(detail, line)
                            )
                        detail = "./".join(detail) + "."
                    return detail, is_adj

                word, _, rest = line.partition(" ")
                if "!" in word:
                    word = util.adjust_verb(word)

                definitions = []
                raw_definitions = rest.split(";")
                for raw_definition in raw_definitions:
                    is_adj = False
                    raw_definition = raw_definition.strip()
                    if raw_definition[0] == "(":
                        raw_definition = raw_definition.lstrip("(")
                        detail, _, raw_definition = raw_definition.partition(")")
                        detail, is_adj = process_detail(detail)
                        raw_definition = (f"({detail}) " if detail else "") + f"{raw_definition}"
                    definitions.append((raw_definition, is_adj))
                add(word, definitions)

        print("\tSorting: {:}".format(path))
        with open(path, "w") as f:
            f.write("\n".join(sorted_lines))

    validate_dictionary(out_dict)
    print(f"Writing dictionary to: {args.output}")
    json.dump(out_dict, open(args.output, "w"), separators=(",\n", ":"))


if __name__ == "__main__":
    main()
