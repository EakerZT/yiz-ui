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

### Theming

All design tokens are CSS custom properties defined in `scripts/style.less`, prefixed with `--yiz-`. The palette includes primary, success, warning, and error color scales (each with light/heavy variants). Individual components reference these tokens and can also accept arbitrary hex colors at runtime via `@ctrl/tinycolor` manipulation applied to inline `--yiz-button-color-*` custom properties.

### Path aliases

During development, `yiz-ui` is aliased to `./scripts` via `vite.config.mts` so the demo can import from `'yiz-ui'` as a consumer would. In production builds, the alias is removed so the real package import resolves from `node_modules`.

### Current components

| Component | Directory | Notes |
|-----------|-----------|-------|
| Button    | `scripts/button/`   | `type`: default / primary / plain; `color`: default / primary / success / warning / error / hex; `shape`: default / round / circle; supports disabled state and ripple wave animation |
| Input     | `scripts/input/`    | v-model binding via `defineModel`, clearable, prefix/suffix slots or props, focus ring |
| Icon      | `scripts/icon/`     | Wrapper that accepts a component (from `@vicons/fluent`) via prop or slot, configurable `size` |

### Key dependencies

- **Vue 3.2+** (peer dependency)
- **@vicons/fluent** — icon set used by Input (clear button) and demo
- **@ctrl/tinycolor** — runtime color manipulation for hex-to-tinted-variant buttons
- **Vite** — dev server and build
- **Less** — CSS preprocessor
- **TypeScript** — strict mode with `noUnusedLocals` and `noImplicitAny`

## Conventions

- No semicolons, single quotes, 120-char print width, trailing commas disabled (see `.prettierrc`)
- Components use `<script setup lang="ts">` with typed props via `defineProps` / `withDefaults`
- Slots are typed with `defineSlots`
- v-model uses `defineModel` (Vue 3.4+)
