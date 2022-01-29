#!/usr/bin/env python3
import argparse
import json


def main():
    parser = argparse.ArgumentParser(
        description="Uses an input file of mappings of Roman letter sequences to devanagari to build a trie"
    )
    parser.add_argument("input_file", help="The input JSON file containing the mapping")
    parser.add_argument("-o", "--output", required=True, help="The output JSON file in which to save the trie.")

    args, _ = parser.parse_known_args()

    mapping_rules = json.load(open(args.input_file))

    output = {}
    output["rules"] = mapping_rules["rules"]

    trie = {}
    for category, category_map in mapping_rules["sequence_map"].items():
        output[category] = list(category_map.values())

        for sequence, target_char in category_map.items():
            assert sequence, "Sequence mapping cannot contain an empty sequence!"

            cur_dict = trie
            for elem in sequence[:-1]:
                if elem not in cur_dict:
                    cur_dict[elem] = {}
                cur_dict = cur_dict[elem]

            # Set inner-most dictionary to contain the target character
            if sequence[-1] not in cur_dict:
                cur_dict[sequence[-1]] = {}
            cur_dict[sequence[-1]][""] = target_char

        output["sequence_map"] = trie

    print(f"Writing Trie to: {args.output}")
    json.dump(output, open(args.output, "w"))


if __name__ == "__main__":
    main()
