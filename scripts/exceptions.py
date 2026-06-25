"""Custom exception classes for Project Vyasa."""


class VyasaError(Exception):
    """Base exception for Project Vyasa."""
    pass


class SandhiError(VyasaError):
    """Raised when sandhi processing fails."""
    def __init__(self, message: str, word1: str = "", word2: str = "", rule: str = ""):
        self.word1 = word1
        self.word2 = word2
        self.rule = rule
        super().__init__(message)


class TransliterationError(VyasaError):
    """Raised when transliteration fails."""
    def __init__(self, message: str, input_text: str = "", ruleset: str = ""):
        self.input_text = input_text
        self.ruleset = ruleset
        super().__init__(message)


class DictionaryError(VyasaError):
    """Raised when dictionary operations fail."""
    def __init__(self, message: str, word: str = "", entry: str = ""):
        self.word = word
        self.entry = entry
        super().__init__(message)


class ContentFormatError(VyasaError):
    """Raised when content file format is invalid."""
    def __init__(self, message: str, file_path: str = "", line_num: int = 0, line: str = ""):
        self.file_path = file_path
        self.line_num = line_num
        self.line = line
        super().__init__(message)


class ValidationError(VyasaError):
    """Raised when validation fails."""
    def __init__(self, message: str, errors: list = None):
        self.errors = errors or []
        super().__init__(message)


class GrammarError(VyasaError):
    """Raised when grammar parsing fails."""
    def __init__(self, message: str, verse_num: int = 0, line_num: int = 0, word: str = ""):
        self.verse_num = verse_num
        self.line_num = line_num
        self.word = word
        super().__init__(message)