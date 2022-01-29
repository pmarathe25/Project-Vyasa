SOURCE_DIR := src
BUILD_DIR := build
SCRIPTS_DIR := scripts
RAW_CONTENT_DIR := raw_content

all: $(patsubst $(RAW_CONTENT_DIR)/%.json,$(BUILD_DIR)/%_trie.json,$(wildcard $(RAW_CONTENT_DIR)/*.json))

$(BUILD_DIR):
	mkdir -p $@

$(BUILD_DIR)/%_trie.json: $(RAW_CONTENT_DIR)/%.json $(SCRIPTS_DIR)/build_trie.py | $(BUILD_DIR)
	python3 $(SCRIPTS_DIR)/build_trie.py $< -o $@

launch:
	python3 -m http.server --directory $(SOURCE_DIR)

test:
	python3 -m pytest tests/ -vv
	npm test

clean:
	rm -rf $(BUILD_DIR)