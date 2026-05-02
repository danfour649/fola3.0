#!/usr/bin/env python3
"""
Bulk markdown to DOCX/PDF conversion for the project docs folder.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from doc_exporter import convert_markdown_file, parse_formats


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DOCS_DIR = PROJECT_ROOT / "docs"
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "deliverables"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert all markdown docs to DOCX/PDF."
    )
    parser.add_argument(
        "--docs-dir",
        default=str(DEFAULT_DOCS_DIR),
        help="Directory containing markdown files.",
    )
    parser.add_argument(
        "--out-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help="Directory for exported files.",
    )
    parser.add_argument(
        "--formats",
        default="docx,pdf",
        help="Comma-separated formats: docx,pdf",
    )
    parser.add_argument(
        "--glob",
        default="*.md",
        help="Glob pattern for markdown files (default: *.md).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    docs_dir = Path(args.docs_dir).resolve()
    out_dir = Path(args.out_dir).resolve()
    formats = parse_formats(args.formats)

    if not docs_dir.exists():
        raise FileNotFoundError(f"Docs directory not found: {docs_dir}")

    md_files = sorted(docs_dir.glob(args.glob))
    if not md_files:
        print(f"No markdown files found in {docs_dir} with pattern '{args.glob}'.")
        return

    for md_file in md_files:
        outputs = convert_markdown_file(
            input_path=md_file,
            output_dir=out_dir,
            output_basename=md_file.stem,
            formats=formats,
        )
        generated = ", ".join(str(path) for path in outputs.values())
        print(f"[OK] {md_file.name} -> {generated}")


if __name__ == "__main__":
    main()
