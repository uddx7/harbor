```markdown
# harbor Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and workflows of the **harbor** repository—a TypeScript/React project with a modular architecture and strong focus on feature-driven development, settings integration, localization, and UI polish. It covers coding conventions, commit styles, and step-by-step guides for the most common workflows, including feature implementation, i18n, player UI updates, backend security fixes, and branch synchronization.

## Coding Conventions

### File Naming
- **Style:** `snake_case`
- **Example:**  
  ```
  src/components/player_overlay.tsx
  src/lib/settings/defaults.ts
  ```

### Import Style
- **Alias-based imports** are preferred.
- **Example:**
  ```typescript
  import { PlayerOverlay } from '@/components/player_overlay';
  import { defaultSettings } from '@/lib/settings/defaults';
  ```

### Export Style
- **Named exports** are standard.
- **Example:**
  ```typescript
  // src/lib/settings/defaults.ts
  export const defaultSettings = { ... };
  export function getDefaultTheme() { ... }
  ```

### Commit Patterns
- **Types:** Mixed (features, fixes, docs, i18n, etc.)
- **Prefixes:** `fix`, `feat`, `docs`, `i18n`
- **Average length:** ~53 characters
- **Example:**
  ```
  feat: add dark mode toggle to settings panel
  fix: correct overlay z-index stacking issue
  i18n: add French locale and update translations
  docs: update README with player controls
  ```

## Workflows

### Feature or UI Enhancement with Settings Integration
**Trigger:** When adding or updating a feature that requires new settings, options, or configuration.  
**Command:** `/feature-with-settings`

1. **Edit or create feature/component files**  
   - Example: `src/components/new_feature.tsx`, `src/views/feature_panel.tsx`
2. **Update settings logic**  
   - Edit:  
     - `src/lib/settings/defaults.ts` (add default value)
     - `src/lib/settings/types.ts` (add type/interface)
     - Optionally: `src/lib/settings/load.ts` (loading logic)
   - Example:
     ```typescript
     // src/lib/settings/types.ts
     export interface Settings {
       enableNewFeature: boolean;
       // ...
     }
     // src/lib/settings/defaults.ts
     export const defaultSettings = {
       enableNewFeature: false,
       // ...
     };
     ```
3. **Update UI panels exposing the new setting**  
   - Example: `src/views/settings/feature_settings_panel.tsx`
   - Example:
     ```tsx
     // src/views/settings/feature_settings_panel.tsx
     <Checkbox
       checked={settings.enableNewFeature}
       onChange={...}
       label="Enable New Feature"
     />
     ```

---

### i18n Locale Addition or Expansion
**Trigger:** When adding a new language or expanding translations.  
**Command:** `/add-locale`

1. **Add or update translation files**  
   - Example: `src/lib/i18n/locales/fr.json`
2. **Register or update locale**  
   - Edit: `src/lib/i18n/index.ts`
   - Example:
     ```typescript
     import fr from './locales/fr.json';
     export const locales = { en, fr, ... };
     ```
3. **Optionally update documentation or .gitignore**

---

### Player UI Polish or Overlay Update
**Trigger:** When refining or fixing player overlays, HUDs, or control surfaces.  
**Command:** `/player-ui-update`

1. **Edit player overlay/control components**  
   - Example: `src/components/player/overlay_controls.tsx`
2. **Edit overlay containers or layers**  
   - Example: `src/views/player/overlay_container.tsx`
3. **Update shared surfaces if needed**  
   - Example: `src/components/ThreeLiquidGlassSurface.tsx`

---

### Security Fix in Native Backend
**Trigger:** When a security vulnerability is found in the Rust/Tauri backend.  
**Command:** `/security-fix`

1. **Edit Rust backend files**  
   - Example: `src-tauri/src/main.rs`
2. **Update argument handling, serialization, or validation logic**
   - Example:
     ```rust
     // src-tauri/src/main.rs
     fn handle_ipc(args: Args) -> Result<(), Error> {
         // Validate and sanitize args
     }
     ```
3. **Optionally update documentation or merge PRs**

---

### Merge Main into Feature or Fix Branch
**Trigger:** When synchronizing a feature/fix branch with the latest `main`.  
**Command:** `/merge-main`

1. **Merge `main` into the current branch**
2. **Resolve conflicts across affected files**
3. **Commit the merged state**

---

## Testing Patterns

- **Framework:** Unknown (not specified)
- **Test File Pattern:** Files end with `.test.ts`
- **Example:**
  ```
  src/lib/settings/defaults.test.ts
  ```
- **Typical Test Structure:**
  ```typescript
  // src/lib/settings/defaults.test.ts
  import { getDefaultTheme } from './defaults';

  test('returns correct default theme', () => {
    expect(getDefaultTheme()).toBe('light');
  });
  ```

## Commands

| Command                | Purpose                                                      |
|------------------------|--------------------------------------------------------------|
| /feature-with-settings | Start a feature or UI enhancement with settings integration  |
| /add-locale            | Add or expand an i18n locale                                 |
| /player-ui-update      | Polish or update player overlays and UI                      |
| /security-fix          | Apply a security fix to the native (Rust/Tauri) backend      |
| /merge-main            | Merge main into a feature or fix branch                      |
```