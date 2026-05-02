# Anthony & Omolola Enterprises Launch Project

This project is a docs-first workspace for planning and launching Anthony & Omolola Enterprises (A&O) in New Brunswick, Canada, with cleaning as one of the initial service lines.

## What is in this project

- `docs/01-step-by-step-launch-guide.md`: End-to-end startup sequence
- `docs/02-compliance-checklist.md`: Practical legal/tax/employment checklist
- `docs/03-document-pack.md`: Which documents to prepare and store
- `docs/04-first-90-days-plan.md`: Launch execution plan
- `docs/05-sources-and-links.md`: Official reference links (NB + Canada)
- `docs/06-business-plan-anthony-omolola-enterprises.md`: Full business plan draft
- `docs/07-structure-decision-sole-vs-spouse-partnership.md`: Decision matrix and worksheet for choosing setup structure
- `docs/templates/`: Reusable templates in Markdown
- `scripts/`: Document generation utilities
- `deliverables/`: Generated DOCX/PDF output files

## How to use

1. Read the step-by-step launch guide.
2. Work through the compliance checklist and mark completed tasks.
3. Copy templates from `docs/templates/` and adapt them to your business.
4. Keep all supporting files (quotes, contracts, invoices, certificates) in this repository.

## Fast DOCX/PDF generation scripts

These scripts convert project Markdown docs into DOCX and/or PDF.

### Requirements

- Python 3
- `python-docx`
- `reportlab`

Install dependencies:

```bash
python3 -m pip install --user python-docx reportlab
```

### 1) Generate one document

```bash
python3 scripts/generate_doc.py \
  --input docs/06-business-plan-anthony-omolola-enterprises.md \
  --output-dir deliverables \
  --formats docx,pdf
```

Optional:

- `--basename custom-file-name` to override output file name
- `--formats docx` or `--formats pdf` for one format only

### 2) Generate all docs in bulk

```bash
python3 scripts/generate_all_docs.py \
  --docs-dir docs \
  --out-dir deliverables \
  --formats docx,pdf \
  --glob "*.md"
```

### 3) Regenerate business plan deliverables (fixed names)

```bash
python3 scripts/generate_business_plan_docs.py
```

## Important note

This project is an operational planning resource, not legal or tax advice. Confirm final decisions with a New Brunswick lawyer and accountant before launch.
