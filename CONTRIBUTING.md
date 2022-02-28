# Contributing

## Table Of Contents

- [Introduction](#introduction)
- [Setting Up](#setting-up)
- [Adding New Content](#adding-new-content)
- [Integrating Your Changes](#integrating-your-changes)
- [Transliteration Methodology](#transliteration-methodology)
- [Content Format](#content-format)
  - [Base Form](#base-form)
  - [Parts Of Speech](#parts-of-speech)
- [Dictionary Format](#dictionary-format)

# Introduction

There are three main ways you can contribute to Project Vyasa:

1. Reporting errors in already published content by
    [filing a GitHub issue](https://github.com/pmarathe25/Project-Vyasa/issues/new/choose).
    Please include as much detail as you can about what the problem is and, if possible,
    how to correct it.

2. [Adding new content](#adding-new-content).

3. Improving the website itself; to do so, follow the [set up instructions](#setting-up)
    below, make your changes, then [integrate them](#integrating-your-changes) to the main repository.

To add new content or make changes to the website, you'll need to follow the instructions
below to [set up the repository](#setting-up) for local development.

## Setting Up

Before you can start contributing, you'll need to set up the repository for local development:
To do so, you will need to:

1. [Install `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

2. Install required packages:
    ```
    npm i
    ```

3. Install the Gatsby CLI client:
    ```
    npm i -g gatsby-cli
    ```

4. Install packages required for testing:
    ```
    python3 -m pip install -r tests/requirements.txt
    ```

5. Launch the local web server:
    ```
    make launch
    ```

At this point, you should be able to navigate to http://localhost:8000/ in your 
browser to view your local copy of the site.


## Adding New Content

Before adding new content, you should familiarize yourself with the 
[transliteration methodology](#transliteration-methodology), [content format](#content-format), 
and the [dictionary format](#dictionary-format) outlined below. Then:

1. Add your word-by-word text and translation under the relevant text file
    in `content/raw/text/`.

2. For any new words, be sure to add entries to the dictionary in `content/raw/dictionary/`

3. Run `make launch` to build and launch a local copy of the website. 
    This will show you error messages if there are any words missing from 
    the dictionary or any syntax errors in your new content.
    Once it launches successfully, navigate to http://localhost:8000/ in your browser to see it!

Finally, you can [integrate your changes](#integrating-your-changes) to the main repository.


## Integrating Your Changes

To integrate your changes to the main repo:

1. Create a fork of the repository. 

2. After making your changes, run tests locally:
    ```
    make test
    ```

3. Finally, push your changes and 
    [create a pull request](https://github.com/pmarathe25/Project-Vyasa/compare)
    to the `develop` branch.


## Transliteration Methodology

The goal of the special transliteration format used here is to be friendly 
to English keyboards and easy to type. A secondary goal is that it should make 
it easy to apply sandhi automatically. Many of the characters are the same as their 
IAST counterparts, but there are several exceptions, which become straightforward 
once you understand the general principles:

- Double a vowel to lengthen it: `i` -> `इ/i`, `ii` -> `ई/ī`.
- Compound vowels are preserved in their original form: `ai` -> `ए/e`.
  This is a departure from typical conventions but makes it easier to 
  break and/or apply *sandhi*.
- `>` indicates vocalic sounds: `r` -> `र्/r` but `r>` -> `ऋ/ṛ`
- `^` indicates velar sounds: `n` -> `न्/n` but `n^` -> `ङ्/ṅ`
- `~` indicates palatal sounds: `s` -> `स्/s` but `s~` -> `श्/ś`
- `<` indicates retroflex sounds: `t` -> `त्/t` but `t<` -> `ट्/ṭ`
- Special symbols include:
  - `:` which maps to *visarga*, i.e. `ः/ḥ`
  - `.` which maps to *anusvara*, i.e. `ं/ṃ`
  - `'` which maps to *avagraha*, i.e. `ऽ/'`

The specifics of the format can be found under 
[`content/raw/transliteration_rulesets/`](./content/raw/transliteration_rulesets/)


## Content Format

The content for each chapter is stored in separate text file: `content/raw/text/{book}/{chapter}.txt`.

The format of each file is:
```
<verse number (or range if multiple verses)>

<word0> (<base-form>, <parts of speech>) <literal translation>
<word1> (<base-form>, <parts of speech>) <literal translation>
...

<Translation>

<verse number (or range if multiple verses)>

<word0> (<base-form>, <parts of speech>) <literal translation>
<word1> (<base-form>, <parts of speech>) <literal translation>
...

<Translation>

... (more verses)
```

For example, consider the following example input text, given here in IAST:
```
nara eva gacchati
```

Removing the sandhi, this is:
```
naraḥ eva gacchati
```

The corresponding content file might look like this 
(*note: this [transliteration format](#transliteration-methodology) is* not *IAST!*):
```
1

nara: (nara, nom sing) man
aiva indeed
gacchati (!gam, 3 sing pres act ind) goes

The man indeed goes.
```

The format must conform to the following rules:

- Any Sanskrit text must use a special transliteration format that the front-end can 
  ingest and convert into either Devanagari or IAST. 
  See the [transliteration](#transliteration-methodology) section for details.

- Sections must be separated by a single blank line. 

- For each verse, the first section must indicate the verse number(s). 
  If the section includes more than one verse, the range of verses may be 
  specified using a dash to separate the start and end verse numbers, e.g. `1-3`.

- There must not be any blank lines within a section

- Each set of words belonging to a single verse must be grouped into a single section, 
  and the corresponding complete translation must be in the subsequent section.

- Each word of the verse text must appear on a separate line, in non-*sandhi*ed form
  and followed by its root, parts of speech, and a literal translation.

  For indeclinable words whose root is the same as the word, the "base-form" and
  "parts of speech" fields may be omitted. 
  For example: `ca and` rather than `ca (ca, indc) and`.

  The [`process_text.py`](./scripts/process_text.py) script can automatically generate 
  text with *sandhi* applied based on the word-by-word input. As of this writing, 
  some *sandhi* may not yet be implemented. Fortunately, adding new rules is easy! 

- If the verse text needs to be split on more than one line, use a line containing a 
  single dash, `-`, to mark where the line break should be. For example:
  ```
  word0 (base-form, parts of speech) literal translation
  -
  word1 (base-form, parts of speech) literal translation
  ```

More detail on the fields in parentheses is provided in the following sections.

### Base Form

The `base-form` field should be either the verbal root or noun stem (depending on the word) 
written in our [special transliteration format](#transliteration-methodology).
Some common syntax rules to consider:

- Compounds must be split using plus signs, i.e. `+`. For example: `bahu+vriihi`.
  This allows the frontend to split them up and provide definitions for each consituent word
  in a pop-out bubble.

- Verbal roots should be prefixed with an exclamation mark, i.e. `!`. For example: `!gam`.

- In cases where a single verbal root is used for multiple verbs meaning different things, 
    append the verb class in roman numerals after a pipe character, i.e. `|`. 
    For example: `!ks<i|VI`. 

- Pre-verbs must be separated from their roots by dashes, i.e. `-`. For example: `ava-!gam`.

### Parts Of Speech

The `parts of speech` field is order invariant and must be provided in 
abbreviated form as a space-separated list. 
Valid entries are as follows:

- `nom/voc/acc/inst/dat/abl/gen/loc`: Nominative/Vocative/Accusative/Instrumental/Dative/Ablative/Genitive/Locative case
- `1/2/3`: 1st/2nd/3rd person
- `sing/du/pl`: Singular/Dual/Plural number
- `pres/perf/imp/fut`: Present/Perfect/Imperfect/Future tense
- `act/pass/mid`: Active/Passive/Middle voice
- `caus/des`: Causative/Desiderative form
- `ind/pot/impv`: Indicative/Potential/Imperative mood
- `inf`: Infinitive
- `abs`: Absolutive
- `ger`: Gerund
- `part`: Participle

Additionally, for adjectives and participles, gender must be provided 
(for other words, this is recorded in the dictionary instead):

- `m/f/n`: Masculine/Feminine/Neuter gender


## Dictionary Format

This project also includes a miniature dictionary. 
Entries are split into files based on their starting character: 
`content/raw/dictionary/{character}.txt` and each word is 
provided in stem/root form (i.e. not declined/conjugated) on a separate line.

The dictionary format is:
```
<word> (<detail>) <meanings...> [<optional root/reference>{, <optional parts of speech>}]
... (more words)
```

For example:
```
!nam to bend, to bow
naaimis<a (m) Naimisha, a sacred forest
naaman (n) name
naaraayan<a (m) Narayana, a name for Vishnu
namas-!kr> to bow, to pay homage
nandana (m) son, lit. "delighter"
nara (m) man
ni-!saiv to visit, to frequent, to honour [!saiv]
nirdis<t<a (adj) pointed out, shown, appointed
```

The `word` field follows almost the same format as the 
[`base-form` field](#base-form) in the content files with the 
exception that it **cannot** include compounds in *split* form. 
Instead, they should be provided as a single word with their components
mentioned in the reference field:
```
dvija (mn) twice-born, referring to a physical birth and then a spiritual birth [dvi+ja]
```

The `detail` field is only required for the following types:
- Adjectives. For example: `uttama (adj) highest, best`
- Indeclinables. For example: `ca (indc) and`
- Nouns, to specify gender. For example: `nara (m) man`.
  Multiple genders may be specified, in which case they should 
  be concatenated, e.g. `mn`. 

In some cases, you may want to include parentheses at the beginning of 
your definition. To prevent the parser from confusing this with the `detail`
field, you can include an empty set of parentheses immediately prior:
```
ja () (in or at the end of a compound) born, born of [!jan]
```

The format of the `root/reference` and `optional parts of speech` fields 
is the same as that of the [`base-form` field](#base-form) and 
[`parts of speech` field](#parts-of-speech) in the content files respectively.

The root/reference word is optional, and if provided, should be enclosed in 
square brackets: 
```
vaasin (mn) staying, dwelling [!vas]
```

You may also specify parts of speech along with the root/reference if the word is a special
form of the root/reference: 
```
bhaavita (adj) being, manifested [!bhuu, perf pass caus part]
```


