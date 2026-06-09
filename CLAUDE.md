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

### Table component (`scripts/table/`)

The most complex component. Three files:

- **`Table.vue`** — main SFC using a dual-table structure: separate `<table>` elements for header and body, synchronized via `<colgroup>` + `table-layout: fixed`. Flex column layout fills parent height (no `height` prop). Features: sorting, column resize with min/max constraints, single/multi selection (v-model via `defineModel`), row-level select disabling (`selectDisabled`), `select` event (emits full row data), row numbers, empty state slot, fixed columns with sticky positioning, header scrollbar-gap compensation.
- **`TableColumn.vue`** — renderless declarative component; declares column config via props (`label`, `field`, `width`, `sortable`, `align`, `minWidth`, `maxWidth`, `fixed`). Supports a `#default` slot for custom cell rendering.
- **`CellRenderer.vue`** — internal helper that calls a slot render function with `{ value, row, index }` scope and returns VNodes. Uses `defineComponent` with a setup-returning-render-function pattern (NOT `<script setup>`).

**Slot-based column declaration:** The table uses `useSlots()` to iterate VNode children, finds `TableColumnComp` instances, and extracts their props + default slot functions (`(vnode as any).children.default`). This eliminates the need for a separate `columns` prop — consumers declare columns declaratively as children:

```html
<y-table :data="data">
  <y-table-column label="姓名" field="name" sortable />
  <y-table-column label="年龄" field="age" align="center">
    <template #default="{ value }">{{ value }} 岁</template>
  </y-table-column>
</y-table>
```

**Virtual columns:** `displayColumns` prepends `__yiz_select` (when `selectMode !== 'none'`) and `__yiz_row_no` (when `no` is true). These are marked `fixed: 'left'` and excluded from width distribution (`computeWidths`) and resize.

**Fixed columns:** `TableColumn.fixed` (`'none' | 'left' | 'right'`) — `displayColumns` reorders user columns so left-fixed come first (after virtual columns), then non-fixed, then right-fixed. `fixedOffsets` computed calculates cumulative sticky `left`/`right` offsets. During resize, fixed column widths are preserved from `columnWidths` to prevent sticky-offset drift.

**Key props on `y-table`:** `data`, `bordered`, `stripe`, `size`, `resize`, `no`, `selectMode`, `rowKey`, `selectDisabled`, `v-model:selected`.

**Key events:** `select` — fires when selection changes, payload is the selected row data (single object for single mode, array for multi mode, null when deselected in single mode).

**Right-fixed column border:** `borderMarkerFields` computed identifies the last non-fixed column before right-fixed columns and the first right-fixed column. CSS removes `border-right` from the former and adds `border-left` to the latter, creating a clean boundary line.

### Shared z-index pattern

`scripts/zIndex.ts` exports `nextZIndex()` — a counter starting at 2000, incrementing by 2 (so mask gets an even z-index, panel gets mask+1). **Dialog** and **Drawer** both:

1. Call `currentZIndex.value = nextZIndex()` on open
2. Render mask at `zIndex: currentZIndex` (inline style), panel at `zIndex: currentZIndex + 1` (inline style on the `position: fixed` wrapper — NOT on an inner non-positioned element, or z-index won't apply)
3. Use `<Teleport to="body">` to escape parent stacking contexts
4. Lock body scroll on open, restore on close/unmount
5. Handle Escape key via document `keydown` listener
6. Use inline SVG for close buttons (no dependency on `@vicons/fluent`)

### Group component pattern (provide/inject)

`CheckboxGroup` and `RadioGroup` use `provide('yizCheckboxGroup' | 'yizRadioGroup', { modelValue, disabled, toggleValue })` to share state with child `Checkbox`/`Radio` components. Children call `inject` with the group context and fall back to standalone mode when no group is found. This pattern should be followed for any future group components.

### Option-based rendering

`CheckboxGroup` and `RadioGroup` accept an `options` prop (`CheckboxOption[]` / `RadioOption[]` — interfaces exported from the `.vue` file) that auto-renders children. When `options` is omitted, a `<slot>` is used instead.

### LinkButton (`scripts/link-button/`)

A text-only button styled as an inline link. Props: `color` (`'default' | 'primary' | 'success' | 'warning' | 'error' | hex`), `disabled`, `underline` (shows underline on hover). Uses the same `@ctrl/tinycolor` hex manipulation pattern as Button for custom colors. Styled via `--yiz-link-button-color-*` CSS custom properties. No border, no background — pure text with color transitions on hover/active/disabled.

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
- Overlay components (Dialog, Drawer) use `<Teleport to="body">` with `scripts/zIndex.ts` for stacking
