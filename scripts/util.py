import copy
import os
from collections import OrderedDict


def get_mtime(path):
    return os.stat(path).st_mtime


def chunks(inp_iter, chunk_size):
    for idx in range(0, len(inp_iter), chunk_size):
        yield inp_iter[idx : idx + chunk_size]


def adjust_verb(verb):
    verb = verb.replace("!", "√")
    if "|" in verb:
        verb, _, cls = verb.partition("|")
        verb = f"{verb} ({cls})"
    return verb


# Follow a consistent ordering for every word
# Format: abbreviation, full-form, type
PARTS_OF_SPEECH_MAPPING = OrderedDict(
    [
        ("nom", ("nominative", "case")),
        ("voc", ("vocative", "case")),
        ("acc", ("accusative", "case")),
        ("inst", ("instrumental", "case")),
        ("dat", ("dative", "case")),
        ("abl", ("ablative", "case")),
        ("gen", ("genitive", "case")),
        ("loc", ("locative", "case")),
        ("1", ("first person", "person")),
        ("2", ("second person", "person")),
        ("3", ("third person", "person")),
        ("sing", ("singular", "number")),
        ("du", ("dual", "number")),
        ("pl", ("plural", "number")),
        ("m", ("masculine", "gender")),
        ("f", ("feminine", "gender")),
        ("n", ("neuter", "gender")),
        ("pres", ("present", "tense")),
        ("perf", ("perfect", "tense")),
        ("imp", ("imperfect", "tense")),
        ("fut", ("future", "tense")),
        ("act", ("active", "voice")),
        ("pass", ("passive", "voice")),
        ("mid", ("middle", "voice")),
        ("ind", ("indicative", "mood")),
        ("pot", ("potential", "mood")),
        ("impv", ("imperative", "mood")),
        ("caus", ("causative", "other")),
        ("des", ("desiderative", "other")),
        ("desadj", ("desiderative", "other")),
        ("abs", ("absolutive", "form")),
        ("part", ("participle", "form")),
        ("ger", ("gerund", "form")),
        ("inf", ("Infinitive", "form")),
        ("sup", ("Superlative", "degree")),
    ]
)

NOUN_PARTS = set(["case", "number"])
VERB_PARTS = set(["person", "number", "tense", "voice", "mood"])
PARTICIPLE_PARTS = NOUN_PARTS | {"tense", "voice", "form", "gender"}
DESIDERATIVE_ADJECTIVE_PARTS = NOUN_PARTS


def process_parts_of_speech(
    parts_of_speech, is_verb, err_prefix, is_declined=True, is_adj=None, dictionary_entries=None
):
    """
    Processes a space separate sequence of parts of speech, validates it, then returns
    a string including the full forms.

    Args:
        parts_of_speech (Sequence[str]): The parts of speech, in abbreviated form.
        is_verb (bool): Whether the parts of speech are describing a verb.
        err_prefix (str): A prefix to prepend to any error messages emitted.
        is_declined (bool):
                Whether the word is declined if it is a noun or adjective.
                For non-declined words, case and number are not required.
        is_adj (bool):
                Whether the word is an adjective or not.
        dictionary_entries (List[List[str]]):
                A list of dictionary entries for each part of the root.
                These will be used to check whether the word in question is an
                adjective, and therefore whether it needs to specify gender.

    Returns:
        str: The parts of speech in their full form.
    """
    if not parts_of_speech:
        return parts_of_speech

    dictionary_entries = dictionary_entries or []

    orig_parts_of_speech = copy.copy(parts_of_speech)

    def show_error(msg):
        raise RuntimeError(err_prefix + msg + f"\nNote: parts of speech were: {orig_parts_of_speech}")

    sorted_parts = OrderedDict()
    part_functions = set()
    parts_of_speech = set(filter(lambda x: x, parts_of_speech.strip().split(" ")))
    for part in PARTS_OF_SPEECH_MAPPING:
        if part not in parts_of_speech:
            continue

        parts_of_speech.remove(part)
        _, part_function = PARTS_OF_SPEECH_MAPPING[part]
        if part_function in part_functions:
            show_error(f"{part_function} was specified more than once.")
        part_functions.add(part_function)
        sorted_parts[part_function] = part

    if parts_of_speech:
        show_error(f"Unrecognized parts of speech: {parts_of_speech}")

    def check_parts(expected):
        if not is_declined:
            expected = copy.copy(expected) - NOUN_PARTS - {"gender"}

        if expected != part_functions:
            show_error(f"Expected parts of speech: {expected}, but received: {part_functions}")

    # Validate that part functions are ok
    if "other" in part_functions:
        if not is_verb:
            show_error(f"Cannot use parts of speech: {sorted_parts['other']} for non-verbs!")
        part_functions.remove("other")

    if is_verb:
        if "other" in sorted_parts and sorted_parts["other"] == "desadj":
            check_parts(DESIDERATIVE_ADJECTIVE_PARTS)
        elif "form" in sorted_parts:
            if sorted_parts["form"] == "part":
                check_parts(PARTICIPLE_PARTS)
            else:
                # Otherwise form must be the only part
                check_parts({"form"})
        else:
            check_parts(VERB_PARTS)
    elif sorted_parts:
        is_adj = is_adj or any("(adj.)" in entry[0] for entry in dictionary_entries)
        if "degree" in part_functions:
            if not is_adj:
                show_error(f"Cannot use parts of speech: {sorted_parts['degree']} for non-adjectives!")
            part_functions.remove("degree")

        check_parts(NOUN_PARTS | ({"gender"} if is_adj else set()))

    new_parts = [PARTS_OF_SPEECH_MAPPING[part][0] for part in sorted_parts.values()]
    return " ".join(new_parts).title()
