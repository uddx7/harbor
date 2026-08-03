---
name: localization-and-i18n-workflow
description: Workflow command scaffold for localization-and-i18n-workflow in harbor.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /localization-and-i18n-workflow

Use this workflow when working on **localization-and-i18n-workflow** in `harbor`.

## Goal

Adds or updates UI localization, including new language support and translation file updates.

## Common Files

- `src/lib/i18n/locales/*.json`
- `src/lib/i18n/index.ts`
- `.gitignore`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add locale JSON files (e.g., en.json, ru.json, ar.json, pt.json).
- Update i18n index or registration files to include new locales.
- Optionally update .gitignore or documentation to reflect localization changes.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.