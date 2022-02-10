SOURCE_DIR := src
SCRIPTS_DIR := scripts

RAW_CONTENT_DIR := content/raw
RAW_RULE_SET_DIR := $(RAW_CONTENT_DIR)/transliteration_rulesets
RAW_CHAPTERS_DIR := $(RAW_CONTENT_DIR)/text
RAW_DICTIONARY_DIR := $(RAW_CONTENT_DIR)/dictionary

GEN_CONTENT_DIR := content/generated
GEN_RULE_SET_DIR := $(GEN_CONTENT_DIR)/transliteration_rulesets
GEN_CHAPTERS_DIR := $(GEN_CONTENT_DIR)/text
GEN_DICTIONARY_DIR := $(GEN_CONTENT_DIR)/dictionary

BUILD_RULE_SET_SCRIPT := $(SCRIPTS_DIR)/build_transliteration_ruleset.py
PROCESS_TEXT_SCRIPT := $(SCRIPTS_DIR)/process_text.py
BUILD_DICTIONARY_SCRIPT := $(SCRIPTS_DIR)/build_dictionary.py

GEN_RULE_SETS := $(patsubst $(RAW_RULE_SET_DIR)/%.json,$(GEN_RULE_SET_DIR)/%.json,$(wildcard $(RAW_RULE_SET_DIR)/*.json))

RAW_CHAPTERS = $(wildcard $(RAW_CHAPTERS_DIR)/*/*.txt)
GEN_CHAPTERS := $(addprefix $(GEN_CHAPTERS_DIR)/,$(notdir $(patsubst %.txt,%.json,$(RAW_CHAPTERS))))

RAW_DICTIONARY_FILES = $(wildcard $(RAW_DICTIONARY_DIR)/*.txt)
GEN_DICTIONARY_FILE = $(GEN_DICTIONARY_DIR)/all_words.json

all: $(GEN_RULE_SETS) $(GEN_CHAPTERS) $(GEN_DICTIONARY_FILE)

$(GEN_RULE_SET_DIR):
	mkdir -p $@

$(GEN_CHAPTERS_DIR):
	mkdir -p $@

$(GEN_DICTIONARY_DIR):
	mkdir -p $@

$(GEN_RULE_SET_DIR)/%.json: $(RAW_RULE_SET_DIR)/%.json $(BUILD_RULE_SET_SCRIPT) | $(GEN_RULE_SET_DIR)
	python3 $(BUILD_RULE_SET_SCRIPT) $< -o $@

$(GEN_DICTIONARY_FILE): $(RAW_DICTIONARY_FILES) $(BUILD_DICTIONARY_SCRIPT) | $(GEN_DICTIONARY_DIR)
	python3 $(BUILD_DICTIONARY_SCRIPT) $(RAW_DICTIONARY_DIR) -o $@

# Automatic rules don't work well when we want to go from a nested input structure
# to a flattened output structure, so we'll manage timestamps within the script.
# This rule will trigger for *every* output file when *any* input file is touched.
$(GEN_CHAPTERS_DIR)/%.json: $(RAW_CHAPTERS) $(PROCESS_TEXT_SCRIPT) $(GEN_DICTIONARY_FILE) | $(GEN_CHAPTERS_DIR)
	@ python3 $(PROCESS_TEXT_SCRIPT) $< -o $@ --transliteration-ruleset $(RAW_RULE_SET_DIR)/devanagari.json -d $(GEN_DICTIONARY_FILE)

launch: $(GEN_RULE_SETS) $(GEN_CHAPTERS) $(GEN_DICTIONARY_FILE)
	gatsby develop

test: $(GEN_RULE_SETS)
	python3 -m pytest tests/ -vv
	npm test

clean:
	rm -rf $(GEN_CONTENT_DIR)