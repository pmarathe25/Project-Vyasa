SOURCE_DIR := src
SCRIPTS_DIR := scripts

RAW_CONTENT_DIR := content/raw
RAW_RULE_SET_DIR := $(RAW_CONTENT_DIR)/transliteration_rulesets

GEN_CONTENT_DIR := content/generated
GEN_RULE_SET_DIR := $(GEN_CONTENT_DIR)/transliteration_rulesets

BUILD_RULE_SET_SCRIPT := $(SCRIPTS_DIR)/build_transliteration_ruleset.py

GEN_RULE_SETS := $(patsubst $(RAW_RULE_SET_DIR)/%.json,$(GEN_RULE_SET_DIR)/%.json,$(wildcard $(RAW_RULE_SET_DIR)/*.json))

all: $(GEN_RULE_SETS)

$(GEN_RULE_SET_DIR):
	mkdir -p $@

$(GEN_RULE_SET_DIR)/%.json: $(RAW_RULE_SET_DIR)/%.json $(BUILD_RULE_SET_SCRIPT) | $(GEN_RULE_SET_DIR)
	python3 $(BUILD_RULE_SET_SCRIPT) $< -o $@

launch: $(GEN_RULE_SETS)
	gatsby develop

test: $(GEN_RULE_SETS)
	python3 -m pytest tests/ -vv
	npm test

clean:
	rm -rf $(GEN_RULE_SET_DIR)