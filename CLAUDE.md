# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`yiz-ui` is a Vue 3 UI component library. Components live in `scripts/`, and a Vite-powered demo app in `demo/` is used for development.

## Commands

```bash
# Start the demo/dev server
yarn demo
```

There are currently no test or lint scripts configured.

## Architecture

### Library entry point (`scripts/index.ts`)

Exports all components and provides a Vue plugin (`install`). The plugin registers every component globally with a `Y` prefix — for example, `Button` becomes `YButton`, `Input` becomes `YInput`. Consumers use it as:

```ts
import yiz from 'yiz-ui'
app.use(yiz)
```

### Component structure

Each component lives in `scripts/<name>/` with two files:

- `index.ts` — re-exports the `.vue` component
- `<Name>.vue` — single-file component with `<script lang="ts" setup>`, `<template>`, and `<style lang="less">`

`scripts/components.ts` is the barrel file that gathers all component modules; `scripts/index.ts` re-exports everything from there.

### Adding a new component

1. Create `scripts/<name>/<Name>.vue` and `scripts/<name>/index.ts` (named export)
2. Add `export * from './<name>'` to `scripts/components.ts` (alphabetical order)
3. Create `demo/pages/<Name>Demo.vue`
4. Register the demo page in `demo/App.vue`: add import, `pages` entry, and `navItems` entry

Everything else (plugin registration, path alias, global component name) is automatic.

### Group component pattern (provide/inject)

`CheckboxGroup` and `RadioGroup` use `provide('yizCheckboxGroup' | 'yizRadioGroup', { modelValue, disabled, toggleValue })` to share state with child `Checkbox`/`Radio` components. Children call `inject` with the group context and fall back to standalone mode when no group is found. This pattern should be followed for any future group components.

### Option-based rendering

`CheckboxGroup` and `RadioGroup` accept an `options` prop (`CheckboxOption[]` / `RadioOption[]` — interfaces exported from the `.vue` file) that auto-renders children. When `options` is omitted, a `<slot>` is used instead.

### Ripple wave animation

Button, Checkbox, and Radio share a ripple wave effect. The `yiz-wave` span uses CSS keyframes `yiz-wave-spread` and `yiz-wave-opacity` defined in `scripts/style.less`. The effect is triggered by briefly adding/removing the `yiz-wave` element via a `ref` toggle with a `nextTick` → `setTimeout` pattern.

### Native input overlay pattern

Checkbox and Radio hide a native `<input>` behind a styled `<span>` (the visual indicator). The native input is made transparent but remains interactive for accessibility. This avoids custom keyboard/ARIA handling.

### Theming

All design tokens are CSS custom properties defined in `scripts/style.less`, prefixed with `--yiz-`. The palette includes primary, success, warning, and error color scales (each with light/heavy variants). Individual components reference these tokens and can also accept arbitrary hex colors at runtime via `@ctrl/tinycolor` manipulation applied to inline `--yiz-button-color-*` custom properties.

### Path aliases

During development, `yiz-ui` is aliased to `./scripts` via both `vite.config.mts` and `tsconfig.json` paths so the demo can import from `'yiz-ui'` as a consumer would. In production builds, the alias is removed so the real package import resolves from `node_modules`.

### Key dependencies

- **Vue 3.2+** (peer dependency)
- **@vicons/fluent** — icon set used by Input (clear button) and demo pages
- **@ctrl/tinycolor** — runtime color manipulation for hex-to-tinted-variant buttons
- **Vite** — dev server and build
- **Less** — CSS preprocessor
- **TypeScript** — strict mode with `noUnusedLocals`, `noImplicitAny`, `strictNullChecks`

## Conventions

- No semicolons, single quotes, 120-char print width, trailing commas disabled (see `.prettierrc`)
- Components use `<script setup lang="ts">` with typed props via `defineProps` / `withDefaults`
- Slots are typed with `defineSlots`
- v-model uses `defineModel` (Vue 3.4+)
- Styles are non-scoped Less, namespaced with `yiz-` prefix
- Components that share state use `provide`/`inject` with a string key prefixed `yiz` (e.g. `'yizCheckboxGroup'`)
