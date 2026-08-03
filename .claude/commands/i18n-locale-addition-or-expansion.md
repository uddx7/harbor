---
name: i18n-locale-addition-or-expansion
description: Workflow command scaffold for i18n-locale-addition-or-expansion in harbor.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /i18n-locale-addition-or-expansion

Use this workflow when working on **i18n-locale-addition-or-expansion** in `harbor`.

## Goal

Adds a new language locale or expands translation coverage for an existing locale, updating translation files and sometimes wiring up locale registration.

## Common Files

- `src/lib/i18n/locales/*.json`
- `src/lib/i18n/locales/*.ts`
- `src/lib/i18n/index.ts`
- `.gitignore`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update translation JSON files (src/lib/i18n/locales/*.json or *.ts)
- Register or update locale in src/lib/i18n/index.ts
- Optionally update .gitignore or documentation to reflect new locale

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.