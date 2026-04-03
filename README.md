# Obsidian SVO Marker

A lightweight Obsidian plugin to quickly mark selected text as Subject, Predicate, or Object using CSS classes.

## Features
- Three command-palette commands:
  - `标记主`
  - `标记谓`
  - `标记宾`
- Class-based output:
  - `<span class="svo-subj">...</span>`
  - `<span class="svo-pred">...</span>`
  - `<span class="svo-obj">...</span>`
- Automatic migration from legacy inline-style wrappers to class wrappers.
- Idempotent behavior for repeated operations on the same selection.

## Command IDs (stable)
- `mark-svo-subj`
- `mark-svo-pred`
- `mark-svo-obj`

## How it works
- Select text in a Markdown editor.
- Open command palette and run one of the marker commands.
- The plugin wraps selected text with the corresponding SVO class span.

## Styling
Styles are defined in `styles.css`:

```css
.svo-subj { text-decoration: underline line-through; }
.svo-pred { text-decoration: underline; }
.svo-obj { text-decoration: underline wavy; }
```

You can customize these classes in your theme/CSS snippets if needed.

## Development

### Requirements
- Node.js 18+
- npm

### Install dependencies
```bash
npm install
```

### Dev watch build
```bash
npm run dev
```

### Production build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Manual test steps
1. Open/create a Markdown note.
2. Type a sentence and select a segment.
3. Run `标记主` / `标记谓` / `标记宾` from command palette.
4. Re-run same command on already marked text to verify no duplicate nested wrappers.
5. Switch to another marker command to verify only latest marker remains.
6. Test with old inline-style wrappers to verify migration to class wrappers.

## Install in vault
Copy `main.js`, `manifest.json`, and `styles.css` to:

```text
<Vault>/.obsidian/plugins/<plugin-id>/
```

Then reload Obsidian and enable the plugin via **Settings → Community plugins**.

## Notes
- The plugin does not bind default hotkeys.
- Users can bind shortcuts in Obsidian settings.
- No network calls are required for this plugin.

## References
- [Obsidian API docs](https://docs.obsidian.md)
- [Plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
