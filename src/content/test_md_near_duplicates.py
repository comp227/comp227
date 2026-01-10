import unittest
import textwrap

from find_duplicate_wording import (
    extract_text_blocks,
    tokenize_words,
    content_words,
    simhash64,
    find_near_duplicates,
    Block,
)


class TestMdDedup(unittest.TestCase):
    def test_fenced_code_is_skipped(self):
        md = textwrap.dedent("""
            # Title

            This is a paragraph with enough words to count. It should be extracted cleanly.

            ```python
            def hello():
                return 123
            ```

            This paragraph also has enough words to be included and should not contain code.
        """).strip()

        blocks = extract_text_blocks(md, "example.md", min_words=10)
        texts = [text for _, text in blocks]

        self.assertEqual(len(texts), 2)
        for t in texts:
            self.assertNotIn("def hello", t)

    def test_inline_code_is_removed(self):
        md = "This paragraph has `inline_code()` and enough additional words to exceed the limit."
        blocks = extract_text_blocks(md, "example.md", min_words=8)

        self.assertEqual(len(blocks), 1)
        self.assertNotIn("inline_code", blocks[0][1])

    def test_near_duplicate_detection(self):
        text_a = (
            "This section explains how to install the package using pip "
            "on your system with proper permissions."
        )
        text_b = (
            "This section describes how to install the package with pip "
            "on your machine using the correct permissions."
        )

        tokens_a = content_words(tokenize_words(text_a))
        tokens_b = content_words(tokenize_words(text_b))

        block_a = Block(
            file_path="a.md",
            heading_path="# Install",
            text=text_a,
            tokens_set=frozenset(tokens_a),
            simhash=simhash64(tokens_a),
        )

        block_b = Block(
            file_path="b.md",
            heading_path="# Installation",
            text=text_b,
            tokens_set=frozenset(tokens_b),
            simhash=simhash64(tokens_b),
        )

        results = find_near_duplicates(
            blocks=[block_a, block_b],
            jaccard_threshold=0.7,
            max_pairs=10,
            bands=4,
            same_file=False,
        )

        self.assertGreaterEqual(len(results), 1)
        self.assertGreaterEqual(results[0][2], 0.7)


if __name__ == "__main__":
    unittest.main()
