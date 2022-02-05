# Project Vyasa

## Content Format

The input file structure is: `text/{book}/{chapter}.txt`.

The format of each file is:
```
word0 (base-form, parts of speech) literal translation
word1 (base-form, parts of speech) literal translation

<Translation>

... (next verse)
```

Sections should be separated by a single blank line. 
*Importantly, there cannot be any blank lines within a section!*

Each word should appear on a separate line, in non-*sandhi*ed form.
The `process_text.py` script will generate *sandhi*ed text based on the word-by-word input.

If the word-by-word translation should be split on multiple lines, split the section
with a line containing a single `-`. For example:
```
word0 (base-form, parts of speech) literal translation
-
word1 (base-form, parts of speech) literal translation
```

Any sanskrit text must use a special transliteration format that the front-end can 
ingest and convert into either Devanagari or IAST. See the [transliteration](#transliteration)
section for details.

For example, consider the following example input text, given here in IAST:
```
nara gacchati
```

The corresponding content file would look like this:
```
nara (nara, nom m sing) man
gacchati (!gam, 3 sing pres)

The man goes
```
### Base Form

The `"base-form"` field should be either the verbal root or noun stem, depending on the word.
Some common syntax:

- Compounds should be separated by plus signs, i.e. `+`. For example: `bahu+vriihi`.
- Pre-verbs should be separated from their roots by dashes, i.e. `-`. For example: `ava-gam`.

### Parts Of Speech

The `"parts of speech"` field is order invariant and should be provided in abbreviated form. 
The abbreviations are as follows:

- `indc`: Indeclinable
- `abs`: Absolutive
- `1/2/3`: 1st/2nd/3rd person
- `sing/du/pl`: Singular/Dual/Plural number
- `m/f/n`: Masculine/Feminine/Neuter gender
- `pres/perf/imp/fut`: Present/Perfect/Imperfect/Future tense
- `act/pass/mid`: Active/Passive/Middle voice
- `ind/pot`: Indicative/Potential mood
- `caus/des`: Causative/Desiderative

## Transliteration 

The goal of the special transliteration format used here is to be friendly 
to English keyboards and quick to type. Some of the general principles are:

- Double a vowel to lengthen it: `i` -> `इ/i`, `ii` -> `ई/ī`.
- Compound vowels are preserved in their original form: `ai` -> `ए/e`.
  This is a departure from typical conventions but makes it easier to 
  break and/or apply *sandhi*.
- `>` indicates vocalic sounds: `r` -> `र्/r` but `r>` -> `ऋ/ṛ`
- `^` indicates velar sounds: `n` -> `न्/n` but `n^` -> `ङ्/ṅ`
- `~` indicates palatal sounds: `s` -> `स्/s` but `s~` -> `श्/ś`
- `<` indicates retroflex sounds: `t` -> `त्/t` but `t<` -> `ट्/ṭ`
- Special symbols include:
  - `.` which maps to anusvara, i.e. `ं/ṃ`
  - `'` which maps to avagraha, i.e. `ऽ/'`
  - `:` which maps to visarga, i.e. `ः/ḥ`