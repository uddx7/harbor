---
name: liquid-glass-feature-workflow
description: Workflow command scaffold for liquid-glass-feature-workflow in harbor.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /liquid-glass-feature-workflow

Use this workflow when working on **liquid-glass-feature-workflow** in `harbor`.

## Goal

Implements or refines the Liquid Glass visual effect across multiple UI components, often including bug fixes, settings integration, and compatibility improvements.

## Common Files

- `src/components/ThreeLiquidGlassSurface.tsx`
- `src/components/ExperimentalLiquidGlassSurface.tsx`
- `src/chrome/topbar.tsx`
- `src/chrome/royal-topbar.tsx`
- `src/chrome/topdock.tsx`
- `src/components/player/transport.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create components related to Liquid Glass (e.g., ThreeLiquidGlassSurface, ExperimentalLiquidGlassSurface).
- Update chrome/topbar or related chrome files to integrate or fix Liquid Glass rendering.
- Modify player control components (e.g., transport, skip-pill, volume-indicator) to support or refine Liquid Glass.
- Adjust settings files (e.g., defaults.ts, types.ts) to add or tweak Liquid Glass configuration.
- Update settings or display panels to expose new options or reflect changes.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.