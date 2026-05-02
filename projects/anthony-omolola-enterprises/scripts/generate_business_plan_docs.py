#!/usr/bin/env python3
"""
Generate DOCX and PDF versions of the business plan from markdown.

Outputs:
- deliverables/business-plan-anthony-omolola-enterprises.docx
- deliverables/business-plan-anthony-omolola-enterprises.pdf
"""

from __future__ import annotations

from pathlib import Path

from doc_exporter import convert_markdown_file


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_MD = PROJECT_ROOT / "docs" / "06-business-plan-anthony-omolola-enterprises.md"
OUT_DIR = PROJECT_ROOT / "deliverables"
OUT_BASENAME = "business-plan-anthony-omolola-enterprises"


def main() -> None:
    outputs = convert_markdown_file(
        input_path=SOURCE_MD,
        output_dir=OUT_DIR,
        output_basename=OUT_BASENAME,
        formats=["docx", "pdf"],
    )

    print(f"Generated DOCX: {outputs['docx']}")
    print(f"Generated PDF:  {outputs['pdf']}")


if __name__ == "__main__":
    main()
