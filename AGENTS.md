# Project Instructions

## Language & Output

- Default response language: Chinese (unless user requests otherwise).
- Code comments: Chinese or English depending on repo style.

## Environment & Encoding

- Use PowerShell 7 (`pwsh`) for shell commands. If `pwsh` is unavailable, state the fallback before using the active PowerShell host.
- Always read/write files as UTF-8 without BOM. Never use GBK or ANSI.
- If Chinese appears garbled in terminal output, treat it as an encoding/display issue first; do not rewrite garbled Chinese text in files.
- Preserve existing Chinese characters and punctuation unless the task explicitly asks for copy changes.

## Shell Search Rules

- When running `rg` in PowerShell with a regex that contains `|`, wrap the regex argument in single quotes, for example: `rg -n 'DatePicker|date-picker' scripts demo`. Do not put such regex directly inside an unescaped nested double-quoted `pwsh -Command` string, because PowerShell may parse `|` as a pipeline.

## Project Overview

- `yiz-ui` (`@eakerzt/yiz-ui`) is a Vue 3 component library written in TypeScript.
- Library source lives in `scripts/`; the demo app lives in `site/` and imports the library through the `yiz-ui` alias.
- Build output lives in `dist/` — do not edit generated output unless the task explicitly asks for release artifacts.
- Package manager is Yarn Classic (1.22.22 via Volta); Node is pinned to 25.9.0 via Volta. Do not use `npm`/`pnpm` for package operations in this repo.

## Commands

```powershell
yarn                 # install
yarn dev            # start Vite demo dev server
yarn site:build      # build site -> docs/ (GitHub Pages deploy target)
yarn typecheck       # vue-tsc --noEmit (uses tsconfig.json, includes site)
yarn build           # vite build --config vite.config.lib.mts && vue-tsc --project tsconfig.build.json
```

- There is no test script and no lint script configured (ESLint/Prettier are installed but only Prettier has config in `.prettierrc`).
- `yarn build` emits dual CJS/ESM to `dist/` (`yiz-ui.cjs`, `yiz-ui.mjs`, `index.d.ts`, `yiz-ui.css`). Declaration emit uses `tsconfig.build.json`, which has NO `yiz-ui` path alias and includes only `scripts/**` (not `site/**`).
- `prepublishOnly` runs `yarn typecheck && yarn build` automatically before `npm publish` (README publishes via `npm publish`, not `yarn publish`).

## CI / Deploy

- `.github/workflows/deploy-site.yml` runs on push to `main`/`master`: `yarn install --frozen-lockfile` → `yarn typecheck` → `yarn site:build` → uploads `docs/` to GitHub Pages. Keep `yarn.lock` committed and in sync.
- `.github/workflows/publish-npm.yml` runs on push of `v*` tags (and `workflow_dispatch`): `yarn install --frozen-lockfile` → `yarn typecheck` → `yarn build` → `npm publish --access public`. Releases are triggered by pushing a `v*` tag; the README's manual `npm publish` is a local fallback. The workflow uses `id-token: write` (trusted publishing) and sets no `NODE_AUTH_TOKEN`.

## Code Style

- Follow the existing Vue SFC pattern: `<script lang="ts" setup>`, `<template>`, `<style lang="less">`.
- Follow `.prettierrc`: no semicolons, single quotes, print width 120, no trailing commas.
- TypeScript is strict (`strict`, `noImplicitAny`, `noUnusedLocals`, `strictNullChecks`); avoid `any` unless matching an existing component pattern or Vue slot/VNode extraction requires it.
- Prefer existing local helpers and patterns over new abstractions.
- Use Less for component styles and CSS custom properties prefixed with `--yiz-` for theme tokens.
- Do not reformat unrelated files or rewrite generated files such as `tsconfig.tsbuildinfo`.

## Component Structure

- Each component lives in `scripts/<component-name>/` with `<Name>.vue` plus `index.ts` (named exports).
- Add new component exports to `scripts/components.ts` (alphabetical order).
- `scripts/index.ts` imports `./style.less` + `./global-components`, re-exports components, locale utils, notification APIs, `showContextMenu`, `loadingBar`, and `renderSvg`, and installs all exported components globally with a `Y` prefix (e.g. `Button` → `YButton`).
- Adding a component also requires a demo page in `site/pages/` registered in `site/App.vue` (import + `pages` entry + `menuItems` entry).

## Demo And Alias

- `vite.config.mts` (dev) and `vite.config.site.mts` (site build) alias `yiz-ui` to `./scripts`; `tsconfig.json` has the same path alias. `vite.config.lib.mts` and `tsconfig.build.json` do NOT alias — library build resolves the real package.
- Demo pages should import from `yiz-ui` where that matches consumer usage.

## Internationalization

- Built-in locale files are `scripts/locale/zh-CN.json` (default) and `scripts/locale/en-US.json`.
- Components with default user-facing text should use `$t()` from `scripts/locale`. Add/update keys in both built-in locale files when adding component-facing text.
- Demo-only text is registered in `site/i18n.ts` via `registerLangItem`.

## Common Patterns

- Dialog and Drawer use `scripts/zIndex.ts` (`nextZIndex()`), Teleport to `body`, inline z-index styles, Escape handling, and body scroll locking. Tooltip is the exception — it uses a hardcoded `z-index: 2000` and is NOT Teleported.
- CheckboxGroup and RadioGroup use provide/inject for group state; follow that pattern for future grouped controls (string key prefixed `yiz`, e.g. `'yizCheckboxGroup'`).
- Menu, ContextMenu, Dropmenu, Select, Table, and Tab use slot-based declarative child extraction via renderless child components (e.g. `MenuOption`, `SelectOption`, `TableColumn`).
- Button, Checkbox, Radio, and Switch share the `yiz-wave` ripple animation defined in `scripts/style.less`.
- Checkbox, Radio, and Switch use the native input overlay pattern for accessibility.
- Notification and `showContextMenu` are imperative APIs implemented with `createVNode` and `render`; they are not normal declarative component usage paths. `loadingBar` (`scripts/loading-bar/`) is also imperative but pure-DOM (no VNode/render) — it ports the bprogress engine, uses `--yiz-loading-bar-*` tokens (default color `var(--yiz-color-primary)`, `fail()` uses `var(--yiz-color-error)`), a fixed `--yiz-loading-bar-z-index: 9999` (NOT `nextZIndex()`), and has no declarative component / global registration.
- Document event listeners registered in `onMounted` must be cleaned up in `onBeforeUnmount`.
- Dropmenu uses a renderless trigger pattern: no wrapping DOM element; the trigger slot's first VNode is cloned via `cloneVNode` with `mergeProps=true`, automatically injecting `onClick` (toggle), `ref` (via `setTriggerRef`, handles both native elements and component instances via `$el`), and open/disabled class — consumers need not bind anything. When no `#trigger` slot is provided, a default button is rendered via `h()`. DropmenuPanel is recursive for nested submenus.

## Further Reference

- `CLAUDE.md` contains detailed per-component architecture notes (Table internals, ScrollBox, Menu/ContextMenu, Select positioning, etc.). Consult it when working on a specific component's internals rather than re-deriving the design from source.
- `plans/` holds design/roadmap notes (`SORTABLE_BOX_NOTES.md`, `sortable-box-roadmap.md`) — read these before reworking `SortableBox` internals.
