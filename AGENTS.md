# Obsidian SVO Marker - AGENTS Guide

## Project goal
Build a lightweight Obsidian community plugin that marks selected text as subject/predicate/object (SVO) using CSS classes.

## Current implementation contract
- Plugin entry: `src/main.ts`
- Core logic: `src/marking.ts`
- Styles: `styles.css`
- Commands (stable IDs):
  - `mark-svo-subj` (`标记主`)
  - `mark-svo-pred` (`标记谓`)
  - `mark-svo-obj` (`标记宾`)

## Marker output contract
- Output HTML must be class-based:
  - `<span class="svo-subj">...</span>`
  - `<span class="svo-pred">...</span>`
  - `<span class="svo-obj">...</span>`
- Do not write inline style for new output.
- Keep class names stable once released.

## Behavior contract
- If no active Markdown editor, show notice and do nothing.
- If selection is empty, show notice and do nothing.
- Re-applying the same marker should be idempotent (no nested duplicates).
- Switching marker type should keep only the latest outer marker.
- Legacy migration: detect old inline `text-decoration` marker wrappers and convert to class-based wrappers.

## Engineering constraints
- Keep `main.ts` minimal: lifecycle + command registration only.
- Put feature logic in focused modules (for example `src/marking.ts`).
- Keep startup lightweight; no heavy `onload` work.
- No telemetry, no hidden network calls, no remote code execution.
- Avoid desktop-only APIs unless `manifest.json` sets `isDesktopOnly: true`.
- Use TypeScript strict-friendly patterns.

## UX constraints
- No default hotkeys. Users bind shortcuts themselves.
- Keep command names short and clear.
- Keep notices concise and user-facing.

## Testing checklist
- `npm run lint`
- `npm run build`
- Manual checks in Obsidian:
  - Commands visible in command palette
  - Empty selection notice
  - No-editor notice
  - Same-type idempotency
  - Type switching behavior
  - Legacy inline-style migration

## Release checklist
- Update `manifest.json` version and `versions.json` mapping.
- Ensure release assets include `main.js`, `manifest.json`, `styles.css`.
- Keep command IDs and marker class names backward-compatible.
