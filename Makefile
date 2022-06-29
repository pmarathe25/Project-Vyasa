SOURCE_DIR := src
SCRIPTS_DIR := scripts

CONTENT_DIR := content/

RAW_CONTENT_DIR := $(CONTENT_DIR)/raw
RAW_RULE_SET_DIR := $(RAW_CONTENT_DIR)/transliteration_rulesets
RAW_TEXT_DIR := $(RAW_CONTENT_DIR)/text
RAW_DICTIONARY_DIR := $(RAW_CONTENT_DIR)/dictionary

GEN_CONTENT_DIR := $(CONTENT_DIR)/generated
GEN_RULE_SET_DIR := $(GEN_CONTENT_DIR)/transliteration_rulesets
GEN_TEXT_DIR := $(GEN_CONTENT_DIR)/text
GEN_DICTIONARY_DIR := $(GEN_CONTENT_DIR)/dictionary

BUILD_RULE_SET_SCRIPT := $(SCRIPTS_DIR)/build_transliteration_ruleset.py
PROCESS_TEXT_SCRIPT := $(SCRIPTS_DIR)/process_text.py
BUILD_DICTIONARY_SCRIPT := $(SCRIPTS_DIR)/build_dictionary.py
UTIL_FILE := $(SCRIPTS_DIR)/util.py

GEN_RULE_SETS := $(patsubst $(RAW_RULE_SET_DIR)/%.json,$(GEN_RULE_SET_DIR)/%.json,$(wildcard $(RAW_RULE_SET_DIR)/*.json))

RAW_TEXT = $(wildcard $(RAW_TEXT_DIR)/*/*/*.txt)

RAW_DICTIONARY_FILES = $(wildcard $(RAW_DICTIONARY_DIR)/*.txt)
GEN_DICTIONARY_FILE = $(GEN_DICTIONARY_DIR)/all_words.json

all: $(GEN_RULE_SETS) process_text $(GEN_DICTIONARY_FILE)

$(BUILD_RULE_SET_SCRIPT): $(UTIL_FILE)
	touch $@

$(PROCESS_TEXT_SCRIPT): $(UTIL_FILE)
	touch $@

$(BUILD_DICTIONARY_SCRIPT): $(UTIL_FILE)
	touch $@

$(GEN_RULE_SET_DIR):
	mkdir -p $@

$(GEN_TEXT_DIR):
	mkdir -p $@

$(GEN_DICTIONARY_DIR):
	mkdir -p $@

$(GEN_RULE_SET_DIR)/%.json: $(RAW_RULE_SET_DIR)/%.json $(BUILD_RULE_SET_SCRIPT) | $(GEN_RULE_SET_DIR)
	python3 $(BUILD_RULE_SET_SCRIPT) $< -o $@

$(GEN_DICTIONARY_FILE): $(RAW_DICTIONARY_FILES) $(BUILD_DICTIONARY_SCRIPT) | $(GEN_DICTIONARY_DIR)
	python3 $(BUILD_DICTIONARY_SCRIPT) $(RAW_DICTIONARY_DIR) -o $@ --transliteration-ruleset $(RAW_RULE_SET_DIR)/devanagari.json

# Automatic rules don't work well when we want to go from a nested input structure
# to a flattened output structure, so we'll manage timestamps within the script.
# This rule will trigger for *every* output file when *any* input file is touched.
.PHONY: process_text
process_text: $(RAW_TEXT) $(PROCESS_TEXT_SCRIPT) $(GEN_DICTIONARY_FILE) | $(GEN_TEXT_DIR)
	@ python3 $(PROCESS_TEXT_SCRIPT) $(RAW_TEXT_DIR) -o $(GEN_TEXT_DIR) --transliteration-ruleset $(RAW_RULE_SET_DIR)/devanagari.json -d $(GEN_DICTIONARY_FILE)

launch: $(GEN_RULE_SETS) $(GEN_DICTIONARY_FILE) process_text
	gatsby develop

test: $(GEN_RULE_SETS) $(GEN_DICTIONARY_FILE)
	python3 -m pytest tests/ -vv -x
	npm test

clean:
	rm -rf $(GEN_CONTENT_DIR)