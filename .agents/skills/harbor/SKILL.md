```markdown
# harbor Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute effectively to the `harbor` codebase, a TypeScript project with a focus on modular UI components, settings management, localization, and Tauri-based backend integration (especially for Linux). You'll learn the project's coding conventions, how to implement common feature and fix workflows, and how to maintain consistency in code style and testing.

---

## Coding Conventions

**File Naming**
- Use `snake_case` for file names.
  - Example: `three_liquid_glass_surface.tsx`, `addon_logo.tsx`

**Import Style**
- Use alias imports for modules.
  - Example:
    ```typescript
    import { LiquidGlassSurface } from 'components/three_liquid_glass_surface';
    ```

**Export Style**
- Use named exports.
  - Example:
    ```typescript
    export function skip_pill() { ... }
    export const VOLUME_INDICATOR = ...;
    ```

**Commit Messages**
- Freeform, but often prefixed with `fix:`, `docs:`, or `feat:`
- Keep messages concise (~50 characters).
  - Example: `fix: resolve volume indicator flicker on pause`

---

## Workflows

### Liquid Glass Feature Workflow

**Trigger:** When adding, fixing, or enhancing the Liquid Glass UI effect  
**Command:** `/liquid-glass-feature`

1. Edit or create relevant components:
   - `src/components/three_liquid_glass_surface.tsx`
   - `src/components/experimental_liquid_glass_surface.tsx`
2. Integrate or fix rendering in chrome/topbar files:
   - `src/chrome/topbar.tsx`, `src/chrome/royal_topbar.tsx`, `src/chrome/topdock.tsx`
3. Update player controls for compatibility:
   - `src/components/player/transport.tsx`
   - `src/components/player/skip_pill.tsx`
   - `src/components/player/volume_indicator.tsx`
4. Adjust settings for configuration:
   - `src/lib/settings/defaults.ts`, `src/lib/settings/types.ts`
5. Update settings panels to expose new options:
   - `src/views/settings/theme_panel/display_section.tsx`
   - `src/views/player/panels_layer.tsx`
6. Test and polish for visual/compatibility issues.

**Example:**
```typescript
// src/components/three_liquid_glass_surface.tsx
export function ThreeLiquidGlassSurface(props) {
  // ... implementation of the effect
}
```

---

### Localization and i18n Workflow

**Trigger:** When adding a new language or updating translations  
**Command:** `/add-locale`

1. Edit or add locale JSON files:
   - `src/lib/i18n/locales/en.json`, `ru.json`, `ar.json`, etc.
2. Update locale registration:
   - `src/lib/i18n/index.ts`
3. Optionally update `.gitignore` or docs.

**Example:**
```json
// src/lib/i18n/locales/pt.json
{
  "welcome": "Bem-vindo",
  "settings": "Configurações"
}
```
```typescript
// src/lib/i18n/index.ts
import pt from './locales/pt.json';
export const locales = { pt, ... };
```

---

### Settings or UI Panel Enhancement Workflow

**Trigger:** When enhancing settings panels, navigation, or accessibility  
**Command:** `/enhance-settings-panel`

1. Edit settings or navigation files:
   - `src/views/settings/nav.tsx`, `advanced_panel.tsx`
2. Update supporting libraries:
   - `src/lib/keyboard_navigation.ts`, `theme.ts`
3. Modify or add CSS for improved UI/UX:
   - `src/index.css`
4. Update or add relevant tests:
   - `tests/keyboard_focus.test.ts`

**Example:**
```typescript
// src/views/settings/nav.tsx
export function SettingsNav() {
  // ... improved keyboard navigation
}
```

---

### Linux Tauri Backend Feature or Fix Workflow

**Trigger:** When adding or fixing backend features, especially for Linux  
**Command:** `/linux-backend-feature`

1. Edit or add Rust source files:
   - `src-tauri/src/lib.rs`, `mpv.rs`, `svp.rs`, `multiview.rs`
2. Optionally update frontend bridge/settings:
   - `src/lib/player/mpv_tuning.ts`, `svp.ts`, etc.
3. Test integration with frontend.

**Example:**
```rust
// src-tauri/src/svp.rs
pub fn enable_svp() {
    // ... SVP implementation for Linux
}
```

---

### Addon Assets and Curated List Update Workflow

**Trigger:** When updating addon logos or curated addon lists  
**Command:** `/update-addon-assets`

1. Add, remove, or update files in:
   - `src/assets/addon_logos/`
2. Edit curated addon list:
   - `src/lib/addons_store/curated.ts`
3. Update related UI components:
   - `src/components/addon_logo.tsx`
   - `src/views/settings/picker_previews.tsx`
   - `src/views/settings/stream_filter_preview.tsx`
4. Format or clean up related files.

**Example:**
```typescript
// src/lib/addons_store/curated.ts
export const curatedAddons = [
  { id: 'adblock', logo: 'adblock.png', ... },
  // ...
];
```

---

## Testing Patterns

- Test files follow the `*.test.*` pattern (e.g., `keyboard_focus.test.ts`).
- Testing framework is not specified; look for standard TypeScript/JavaScript testing patterns.
- Place tests alongside the code or in a `tests/` directory.

**Example:**
```typescript
// tests/keyboard_focus.test.ts
import { test, expect } from 'some-test-lib';

test('keyboard navigation works', () => {
  // ... test implementation
});
```

---

## Commands

| Command                 | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| /liquid-glass-feature   | Add, fix, or enhance the Liquid Glass visual effect          |
| /add-locale             | Add or update UI localization and translation files          |
| /enhance-settings-panel | Improve settings panels, navigation, or accessibility        |
| /linux-backend-feature  | Add or fix Linux-specific Tauri backend features             |
| /update-addon-assets    | Update addon logos and curated addon lists                   |
```
