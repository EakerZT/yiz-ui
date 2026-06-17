# Project Instructions

## 2. Language & Output
- Default response language: Chinese (unless user requests otherwise).
- Code comments: Chinese or English depending on repo style.
- Keep explanations concise unless explicitly asked for deep reasoning.

## Encoding Rules

- Always use UTF-8 without BOM.
- Never use GBK or ANSI.
- When reading or writing files, explicitly specify UTF-8.
- Never rewrite garbled Chinese text. If Chinese appears garbled in terminal output, treat it as an encoding/display issue first.
- Preserve existing Chinese characters and punctuation unless the task explicitly asks for copy changes.
- Use PowerShell 7 (`pwsh`) for shell commands. If `pwsh` is unavailable, state the fallback before using the active PowerShell host.

## Project Overview

- `yiz-ui` is a Vue 3 component library written in TypeScript.
- Library source lives in `scripts/`.
- Demo app source lives in `demo/` and imports the library through the `yiz-ui` alias.
- Build output lives in `dist/`; do not edit generated output unless the task explicitly asks for release artifacts.
- Package manager is Yarn Classic. `yarn.lock` is present.

## Commands

```powershell
yarn
yarn demo
yarn typecheck
yarn build
```

- `yarn demo` starts the Vite demo app.
- `yarn typecheck` runs `vue-tsc --noEmit`.
- `yarn build` runs the library Vite build and emits declarations with `vue-tsc`.
- There is no test script and no lint script currently configured.

## Code Style

- Follow the existing Vue SFC pattern: `<script lang="ts" setup>`, `<template>`, and `<style lang="less">`.
- Follow `.prettierrc`: no semicolons, single quotes, print width 120, no trailing commas.
- TypeScript is strict; avoid `any` unless matching an existing component pattern or Vue slot/VNode extraction requires it.
- Prefer existing local helpers and patterns over new abstractions.
- Use Less for component styles and CSS custom properties prefixed with `--yiz-` for theme tokens.
- Do not reformat unrelated files or rewrite generated files such as `tsconfig.tsbuildinfo`.

## Component Structure

- Each component normally lives in `scripts/<component-name>/`.
- Each component folder usually contains:
  - `<Name>.vue`
  - `index.ts` with named exports
- Add new component exports to `scripts/components.ts`.
- `scripts/index.ts` imports `./style.less`, re-exports components, locale utilities, and notification APIs, and installs all exported components globally with a `Y` prefix.
- If adding a component, also add a demo page in `demo/pages/` and register it in `demo/App.vue`.

## Demo And Alias

- `vite.config.mts` aliases `yiz-ui` to `./scripts` for demo development.
- `tsconfig.json` has the same `yiz-ui` path alias.
- Demo pages should import from `yiz-ui` where that matches consumer usage.

## Internationalization

- Built-in locale files are `scripts/locale/zh-CN.json` and `scripts/locale/en-US.json`.
- Components with default user-facing text should use `$t()` from `scripts/locale`.
- Add or update keys in both built-in locale files when adding component-facing text.
- Demo-only text is registered in `demo/i18n.ts`.

## Common Patterns

- Dialog and Drawer use `scripts/zIndex.ts`, Teleport to `body`, inline z-index styles, Escape handling, and body scroll locking.
- CheckboxGroup and RadioGroup use provide/inject for group state; follow that pattern for future grouped controls.
- Menu, ContextMenu, Select, Table, and Tab use slot-based declarative child extraction via renderless child components.
- Button, Checkbox, Radio, and Switch share the `yiz-wave` ripple animation defined in `scripts/style.less`.
- Checkbox, Radio, and Switch use the native input overlay pattern for accessibility.
- Notification is an imperative API implemented with `createVNode` and `render`; it is not a normal declarative component usage path.
