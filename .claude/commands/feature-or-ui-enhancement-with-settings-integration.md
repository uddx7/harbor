---
name: feature-or-ui-enhancement-with-settings-integration
description: Workflow command scaffold for feature-or-ui-enhancement-with-settings-integration in harbor.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-or-ui-enhancement-with-settings-integration

Use this workflow when working on **feature-or-ui-enhancement-with-settings-integration** in `harbor`.

## Goal

Implements or enhances a feature (often UI) that requires updating both implementation files and settings logic/types/defaults.

## Common Files

- `src/lib/settings/defaults.ts`
- `src/lib/settings/types.ts`
- `src/lib/settings/load.ts`
- `src/views/settings/**/*.tsx`
- `src/components/**/*.tsx`
- `src/chrome/**/*.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create feature/component files (e.g. in src/components/, src/chrome/, src/views/)
- Update settings logic (src/lib/settings/defaults.ts, src/lib/settings/types.ts, sometimes src/lib/settings/load.ts)
- Update UI panels that expose the new setting (e.g. src/views/settings/...)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.