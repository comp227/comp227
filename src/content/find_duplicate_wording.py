#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import os
import re
import sys
import unittest
from dataclasses import dataclass
from typing import Dict, Iterable, List, Set, Tuple
from collections import defaultdict

STOPWORDS = {
    "the","a","an","and","or","but","if","then","else","when","while","for","to","of","in","on","at","by",
    "with","without","as","is","are","was","were","be","been","being","this","that","these","those",
    "it","its","they","them","their","you","your","we","our","i","me","my","he","his","she","her",
    "from","into","out","up","down","over","under","again","more","most","some","such","no","nor",
    "not","only","own","same","so","than","too","very","can","could","should","would","may","might",
    "will","just","also",
}

WORD_RE = re.compile(r"[A-Za-z][A-Za-z']+")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
FENCE_RE = re.compile(r"^\s*(```|~~~)")

CODEY_CHARS_RE = re.compile(
    r"[{}\[\]();<>]|==|!=|<=|>=|->|=>|::|///|#include|\b(def|class|import|return|const|let|var)\b"
)

def normalize_whitespace(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def strip_inline_code(s: str) -> str:
    return re.sub(r"`[^`]+`", " ", s)

def strip_markdown_links(s: str) -> str:
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"<https?://[^>]+>", " ", s)
    return s

def tokenize_words(s: str) -> List[str]:
    return [w.lower() for w in WORD_RE.findall(s)]

def content_words(tokens: List[str]) -> List[str]:
    return [t for t in tokens if t not in STOPWORDS]

def jaccard(a: Set[str], b: Set[str]) -> float:
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def looks_like_code(block: str) -> bool:
    s = block.strip()
    if not s:
        return True

    code_hint = bool(CODEY_CHARS_RE.search(s))

    tokens = re.findall(r"\S+", s)
    if not tokens:
        return True

    alpha = sum(1 for t in tokens if re.search(r"[A-Za-z]", t))
    alpha_ratio = alpha / max(1, len(tokens))

    # many non-alphabetic tokens tends to mean code/config
    if alpha_ratio < 0.55:
        return True

    if s.count("`") >= 6:
        return True
    if "|" in s and s.count("|") >= 8:
        return True

    longish = sum(1 for t in tokens if len(t) >= 25)
    if longish / len(tokens) > 0.12:
        return True

    if code_hint and alpha_ratio < 0.72:
        return True

    return False

@dataclass(frozen=True)
class Block:
    file_path: str
    heading_path: str
    text: str
    tokens_set: frozenset
    simhash: int

def iter_markdown_files(root: str) -> Iterable[str]:
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            if name.lower().endswith(".md"):
                yield os.path.join(dirpath, name)

def strip_emphasis_and_html(s: str) -> str:
    # Remove common HTML emphasis tags but keep their content
    s = re.sub(r"</?(i|em|strong|b)>", " ", s, flags=re.IGNORECASE)

    # Remove markdown emphasis markers (*, **, _, __)
    # Replace them with spaces so words don't get joined
    s = re.sub(r"(\*\*|\*|__|_)", " ", s)

    return s

def extract_text_blocks(md: str, file_path: str, min_words: int) -> List[Tuple[str, str]]:
    lines = md.splitlines()
    blocks: List[Tuple[str, str]] = []

    in_fence = False
    fence_marker: str | None = None

    heading_stack: List[Tuple[int, str]] = []
    current_paragraph: List[str] = []

    def current_heading_path() -> str:
        return " > ".join([h for _, h in heading_stack]) if heading_stack else ""

    def flush_paragraph() -> None:
        nonlocal current_paragraph
        if not current_paragraph:
            return
        raw = "\n".join(current_paragraph).strip()
        current_paragraph = []

        cleaned = strip_markdown_links(strip_emphasis_and_html(strip_inline_code(raw)))
        cleaned = normalize_whitespace(cleaned)

        wc = len(tokenize_words(cleaned))
        if wc >= min_words:
            blocks.append((current_heading_path(), cleaned))

    for line in lines:
        fm = FENCE_RE.match(line)
        if fm:
            marker = fm.group(1)
            if not in_fence:
                in_fence = True
                fence_marker = marker
                flush_paragraph()
            else:
                # close only if same marker that opened it (``` closes ```; ~~~ closes ~~~)
                if marker == fence_marker:
                    in_fence = False
                    fence_marker = None
            continue

        if in_fence:
            continue

        hm = HEADING_RE.match(line)
        if hm:
            flush_paragraph()
            level = len(hm.group(1))
            title = normalize_whitespace(hm.group(2))

            while heading_stack and heading_stack[-1][0] >= level:
                heading_stack.pop()
            heading_stack.append((level, f"{'#' * level} {title}"))
            continue

        if not line.strip():
            flush_paragraph()
            continue

        current_paragraph.append(line)

    flush_paragraph()
    return blocks

def _hash64(token: str) -> int:
    h = hashlib.sha1(token.encode("utf-8")).digest()
    return int.from_bytes(h[:8], byteorder="big", signed=False)

def simhash64(tokens: List[str]) -> int:
    if not tokens:
        return 0
    v = [0] * 64
    for t in tokens:
        hv = _hash64(t)
        for i in range(64):
            v[i] += 1 if ((hv >> i) & 1) else -1
    out = 0
    for i in range(64):
        if v[i] > 0:
            out |= (1 << i)
    return out

def band_buckets(h: int, bands: int = 4) -> List[Tuple[int, int]]:
    if 64 % bands != 0:
        raise ValueError("bands must divide 64")
    width = 64 // bands
    mask = (1 << width) - 1
    return [(b, (h >> (b * width)) & mask) for b in range(bands)]

def build_blocks(root: str, min_words: int) -> List[Block]:
    out: List[Block] = []
    for path in iter_markdown_files(root):
        try:
            with open(path, "r", encoding="utf-8") as f:
                md = f.read()
        except UnicodeDecodeError:
            with open(path, "r", encoding="latin-1") as f:
                md = f.read()

        for heading_path, text in extract_text_blocks(md, path, min_words=min_words):
            if looks_like_code(text):
                continue

            tokens = tokenize_words(text)
            tokens2 = content_words(tokens)
            if len(tokens2) < min_words:
                continue

            out.append(Block(
                file_path=path,
                heading_path=heading_path,
                text=text,
                tokens_set=frozenset(tokens2),
                simhash=simhash64(tokens2),
            ))
    return out

# --- find_near_duplicates: add bruteforce param + implementation ---
def find_near_duplicates(
    blocks: List[Block],
    jaccard_threshold: float,
    max_pairs: int,
    bands: int,
    same_file: bool,
    bruteforce: bool = False,
) -> List[Tuple[Block, Block, float]]:
    """
    If bruteforce=True, compares all pairs (O(n^2)) and returns up to max_pairs
    highest-scoring matches >= jaccard_threshold.

    If bruteforce=False, uses SimHash band bucketing to generate candidates.
    """

    # ---------- BRUTE FORCE MODE ----------
    if bruteforce:
        results: List[Tuple[Block, Block, float]] = []
        n = len(blocks)

        for i in range(n):
            A = blocks[i]
            for j in range(i + 1, n):
                B = blocks[j]

                # If same_file is False, skip within-file comparisons
                if not same_file and A.file_path == B.file_path:
                    continue

                score = jaccard(set(A.tokens_set), set(B.tokens_set))
                if score >= jaccard_threshold:
                    results.append((A, B, score))

        # sort best-first and cap output
        results.sort(key=lambda x: x[2], reverse=True)
        return results[:max_pairs]

    # ---------- LSH / SIMHASH MODE ----------
    buckets: Dict[Tuple[int, int], List[int]] = defaultdict(list)
    for i, b in enumerate(blocks):
        for key in band_buckets(b.simhash, bands=bands):
            buckets[key].append(i)

    seen_pairs: Set[Tuple[int, int]] = set()
    results: List[Tuple[Block, Block, float]] = []

    for idxs in buckets.values():
        if len(idxs) < 2:
            continue
        if len(idxs) > 300:
            idxs = idxs[:300]

        for i in range(len(idxs)):
            for j in range(i + 1, len(idxs)):
                a, b = idxs[i], idxs[j]
                pair = (a, b) if a < b else (b, a)
                if pair in seen_pairs:
                    continue
                seen_pairs.add(pair)

                A, B = blocks[pair[0]], blocks[pair[1]]

                if not same_file and A.file_path == B.file_path:
                    continue

                score = jaccard(set(A.tokens_set), set(B.tokens_set))
                if score >= jaccard_threshold:
                    results.append((A, B, score))

    results.sort(key=lambda x: x[2], reverse=True)
    return results[:max_pairs]

def short_snippet(text: str, max_chars: int = 220) -> str:
    t = normalize_whitespace(text)
    return t if len(t) <= max_chars else t[: max_chars - 1] + "…"

def debug_top_matches(blocks, top_n=20, same_file_only=True):
    scored = []
    n = len(blocks)
    for i in range(n):
        for j in range(i + 1, n):
            A, B = blocks[i], blocks[j]
            if same_file_only and A.file_path != B.file_path:
                continue
            score = jaccard(set(A.tokens_set), set(B.tokens_set))
            scored.append((score, A, B))

    scored.sort(key=lambda x: x[0], reverse=True)
    for score, A, B in scored[:top_n]:
        print("=" * 60)
        print(f"DEBUG score: {score:.3f}")
        print(f"A: {A.file_path} | {A.heading_path}")
        print(f"B: {B.file_path} | {B.heading_path}")
        print(f"A snippet: {short_snippet(A.text)}")
        print(f"B snippet: {short_snippet(B.text)}")

def run_cli(argv: List[str]) -> int:
    p = argparse.ArgumentParser(description="Find near-duplicate English sections across markdown files (excluding code).")
    p.add_argument("root", help="Root directory to scan")
    p.add_argument("--min-words", type=int, default=20)
    p.add_argument("--jaccard", type=float, default=0.85)
    p.add_argument("--max-pairs", type=int, default=200)
    p.add_argument("--bands", type=int, default=4)
    p.add_argument("--include-same-file", action="store_true")
    p.add_argument("--show-full", action="store_true")
    p.add_argument("--run-tests", action="store_true", help="Run unit tests and exit")
    p.add_argument("--bruteforce", action="store_true",
               help="Compare all block pairs (slow but highest recall). Great for validation.")
    args = p.parse_args(argv)

    if args.run_tests:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestMdDedup)
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        return 0 if result.wasSuccessful() else 1

    root = os.path.abspath(args.root)
    if not os.path.isdir(root):
        print(f"ERROR: not a directory: {root}", file=sys.stderr)
        return 2

    blocks = build_blocks(root, min_words=args.min_words)
    print("Printing debug info for top matches...")
    debug_top_matches(blocks, top_n=10, same_file_only=True)
    print("Finished building blocks, now finding near-duplicates...")
    if not blocks:
        print("No eligible blocks found.", file=sys.stderr)
        return 0

    dups = find_near_duplicates(
        blocks=blocks,
        jaccard_threshold=args.jaccard,
        max_pairs=args.max_pairs,
        bands=args.bands,
        same_file=args.include_same_file,
        bruteforce=args.bruteforce,
    )


    if not dups:
        print("No near-duplicates found.")
        return 0

    for A, B, score in dups:
        print("=" * 88)
        print(f"Similarity (Jaccard): {score:.3f}")
        print(f"A: {A.file_path}")
        if A.heading_path:
            print(f"   {A.heading_path}")
        print(f"B: {B.file_path}")
        if B.heading_path:
            print(f"   {B.heading_path}")

        if args.show_full:
            print("\n--- Duplicated text (A) ---")
            print(A.text)
            print("\n--- Duplicated text (B) ---")
            print(B.text)
        else:
            print("\n--- Duplicated text snippets ---")
            print(f"A: {short_snippet(A.text)}")
            print(f"B: {short_snippet(B.text)}")

    return 0

if __name__ == "__main__":
    run_cli(sys.argv[1:])