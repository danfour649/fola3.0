#!/usr/bin/env python3
"""
Generate DOCX/PDF from one markdown file.

Examples:
  python3 scripts/generate_doc.py \
    --input docs/06-business-plan-folas-cleaning-company.md \
    --output-dir deliverables \
    --formats docx,pdf
"""

from __future__ import annotations

import argparse
from pathlib import Path

from doc_exporter import convert_markdown_file, parse_formats


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert one markdown file into DOCX and/or PDF."
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Path to markdown file (absolute or relative to project root).",
    )
    parser.add_argument(
        "--output-dir",
        default="deliverables",
        help="Output directory (default: deliverables).",
    )
    parser.add_argument(
        "--basename",
        default=None,
        help="Optional output base filename (without extension).",
    )
    parser.add_argument(
        "--formats",
        default="docx,pdf",
        help="Comma-separated output formats: docx,pdf (default: docx,pdf).",
    )
    return parser.parse_args()


def resolve_path(value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    return PROJECT_ROOT / path


def main() -> None:
    args = parse_args()
    input_path = resolve_path(args.input)
    output_dir = resolve_path(args.output_dir)
    formats = parse_formats(args.formats)

    outputs = convert_markdown_file(
        input_path=input_path,
        output_dir=output_dir,
        output_basename=args.basename,
        formats=formats,
    )

    for fmt, out_path in outputs.items():
        print(f"Generated {fmt.upper()}: {out_path}")


if __name__ == "__main__":
    main()
