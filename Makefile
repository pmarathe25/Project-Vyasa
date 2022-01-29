SOURCE_DIR := src
BUILD_DIR := build
SCRIPTS_DIR := scripts
RAW_CONTENT_DIR := raw_content

TRIES := $(patsubst $(RAW_CONTENT_DIR)/%.json,$(BUILD_DIR)/%_trie.json,$(wildcard $(RAW_CONTENT_DIR)/*.json))

all: $(TRIES)

$(BUILD_DIR):
	mkdir -p $@

$(BUILD_DIR)/%_trie.json: $(RAW_CONTENT_DIR)/%.json $(SCRIPTS_DIR)/build_trie.py | $(BUILD_DIR)
	python3 $(SCRIPTS_DIR)/build_trie.py $< -o $@

launch: $(TRIES)
	gatsby develop

test:
	python3 -m pytest tests/ -vv
	npm test

clean:
	rm -rf $(BUILD_DIR)