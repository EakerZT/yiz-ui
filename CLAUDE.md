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
4. Register the demo page in `demo/App.vue`: add import, `pages` entry, and `menuItems` entry

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

A text-only button styled as an inline link. Uses the same `@ctrl/tinycolor` hex manipulation pattern as Button for custom colors. Styled via `--yiz-link-button-color-*` CSS custom properties.

### Loading (`scripts/loading/`)

Spinner with three `indicator` presets (`ring`, `spin`, `think`), `size` prop, and a `delay` prop (ms before showing — `setTimeout` cleared on unmount/prop change). **Container mode:** when the default slot is used, the spinner is absolutely centered over the content and the content gets `opacity: 0.5; pointer-events: none`. The `#indicator` slot overrides the preset; `#tip` slot overrides the tip text.

### Switch (`scripts/switch/`)

Toggle switch using the native input overlay pattern (hidden `<input type="checkbox">` behind a styled track/thumb). Uses `defineModel<boolean>('modelValue')`. Supports `loading` state (renders an inline SVG spinner via SMIL `<animateTransform>`, sets cursor to `wait`), `color` prop (hex → `@ctrl/tinycolor` manipulation for `--yiz-switch-checked-bg` and `--yiz-switch-checked-hover`), and the shared `yiz-wave` ripple animation on click. Emits `change` event.

### InputNumber (`scripts/input-number/`)

Number input with increment/decrement buttons. Uses `defineModel<number | null>('modelValue')` — null represents empty input. Props: `min`, `max`, `step`, `precision`, `controls` (show +/- buttons), `prefix`/`suffix` (text or slots), `align`. Supports ArrowUp/ArrowDown keyboard shortcuts and Enter key (`pressEnter` event). Uses `defineExpose({ focus })` to expose a focus method to parents. Hides native spinner buttons via `-webkit-appearance: none` / `-moz-appearance: textfield`.

### Icon (`scripts/icon/`)

Renders a Vue component (via `:is`) with 1em-based `width`/`height`. Use the `size` prop to set an explicit `font-size` in px. `display: inline-block` so it behaves like an inline icon; wrap in a flex container when vertical centering is needed.

### Tooltip (`scripts/tooltip/`)

Hover-triggered tooltip with `placement` (`top` | `bottom` | `left` | `right`), CSS arrow border trick, and `<Transition name="yiz-tooltip-fade">`. Content via `content` prop or `#content` slot. Uses a hardcoded `z-index: 2000` (does NOT use `nextZIndex()` — it's positioned `absolute` relative to the trigger, not Teleported).

### Tab (`scripts/tab/`)

- **`Tab.vue`** — main container using slot-based child extraction to find `TabPane` children. Extracts `label`, `value`, `disabled` props from each pane, renders a header row with a sliding active indicator bar, and renders the default slot (which TabPane children control via `v-show`). Uses `v-model:active` (`defineModel`), emits `select` event.
- **`TabPane.vue`** — renderless child that declares `label` / `value` / `disabled` props and a default slot for content. Injects `'yizTab'` context and uses `v-show` to toggle visibility based on whether its `value` matches the parent's `active`.

### Tag (`scripts/tag/`)

Small label/tag component with preset colors and custom hex color support. Props: `color` (`'default' | 'primary' | 'success' | 'warning' | 'error'` or a `#rrggbb` hex string — hex values use `@ctrl/tinycolor` to derive `--yiz-tag-*` CSS custom properties for background, text, border, and close-button hover), `closable` (renders an inline SVG close icon, emits `close`), `size` (`'default' | 'small' | 'large'`), `bordered`. Default slot for tag content.

### Ripple wave animation

Button, Checkbox, Radio, and Switch share a ripple wave effect. The `yiz-wave` span uses CSS keyframes `yiz-wave-spread` and `yiz-wave-opacity` defined in `scripts/style.less`. The effect is triggered by briefly adding/removing the `yiz-wave` element via a `ref` toggle with a `nextTick` → `setTimeout` pattern.

### Native input overlay pattern

Checkbox, Radio, and Switch hide a native `<input>` behind a styled `<span>` (the visual indicator). The native input is made transparent but remains interactive for accessibility. This avoids custom keyboard/ARIA handling.

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

### Slot-based declarative children (Menu, ContextMenu, Select, Table, Tab)

Menu, ContextMenu, and Select mirror Table's slot-based child extraction pattern. Each has a renderless `-option` child component (`MenuOption`, `ContextMenuOption`, `SelectOption`) whose props and default slot functions are extracted via `useSlots()`:

```ts
const slotItems = computed(() => {
  const nodes = slots.default?.() ?? []
  // iterate VNodes, match on child component type, extract props
  for (const vnode of nodes) {
    if (vnode.type === MenuOptionComp && vnode.props) { ... }
  }
})
```

The `allItems` computed falls back to the `items` prop when no slot children are provided. Both APIs coexist — consumers can use either `<y-menu-option>` children or `:items`.

### Menu and ContextMenu

Both components share the same architecture:
- **`Menu.vue`** — main SFC rendering items with select/expand logic. Delegates submenus to `SubMenu` (inline expand) and `PopupSubMenu` (teleported popups).
- **`SubMenu.vue`** (`scripts/menu/SubMenu.vue`) — renders items directly with expand/collapse and slide `<Transition>`. Recursively renders nested `SubMenu` for children. Owns its own `expandedKeys` state.
- **`PopupSubMenu.vue`** (`scripts/menu/PopupSubMenu.vue`) — renders items directly in a `<Teleport>`-ed popup. Handles recursive nested hover popups with edge detection. Owns its own hover/timer state.
- **`MenuOption.vue` / `ContextMenuOption.vue`** — renderless declarative child for slot-based usage
- **`IconRenderer.vue`** (`scripts/menu/IconRenderer.vue`) — shared internal utility that renders icon VNodes; used by both Menu and ContextMenu

**Menu modes:**
- **Default** — sidebar with expandable submenus (inline expand/collapse with `<Transition>`)
- **`collapsed`** — sidebar collapsed to icon-only width (56px); childless items wrap in `<Tooltip>`; items with children show Teleported popups at `z-index: 3000`

**ContextMenu item types** — ContextMenu supports five item `type` values: `item`, `divider`, `submenu`, `checkbox`, and `radiogroup`. The `checkbox` and `radiogroup` types are unique to ContextMenu (not in Menu). Checkbox items maintain a `checkedValues: Set<any>` so multiple can be toggled independently. Radiogroup items use `name` to group selections and store the active value in `radioValues: Map<string, any>`. Both emit `select` with the item + a `checked` boolean.

**ContextMenu submenus** — nested submenus render inline and position with `position: absolute; left: 100%`. Submenu placement flips to `right: 100%` when the submenu would overflow the viewport right edge, and flips vertically when it would overflow the bottom.

**v-model:select:** Menu uses `defineModel<any>('select')` to track the currently selected item value.

### Select

A dropdown selection component combining several patterns:
- **Teleported dropdown** — `<Teleport to="body">` with `position: fixed` positioned via `getBoundingClientRect()` on the trigger element
- **z-index** — calls `nextZIndex()` on open, dropdown renders at `zIndex + 1`
- **Click-outside** — document-level `click` listener (capture phase) closes the dropdown when clicking outside trigger + dropdown refs
- **Keyboard** — Escape to close, ArrowUp/ArrowDown to navigate `hoverIndex`, Enter to select
- **Search** — optional `search` prop (sync or async function returning filtered `SelectOption[]`); renders an `<Input>` in the dropdown
- **`defineModel`** — `defineModel<any>('modelValue')` tracks selected value

### ScrollBox (`scripts/scroll-box/`)

Custom scrollbar component with GPU-accelerated thumb positioning via CSS `@property`. Single file: `ScrollBox.vue`.

**DOM structure** — flex layout: host (`display: flex; flex-direction: column`) → viewport (flex child, `min-height: 0` is critical to allow shrinking below content) → slot content. Track+thumb elements are absolutely positioned, always rendered but hidden via `opacity: 0; visibility: hidden` when not needed. A corner element renders when both axes overflow.

**CSS `@property` GPU positioning** — three registered custom properties drive thumb position entirely on the compositor, avoiding layout/paint:
- `--yiz-scroll-percent` (0..1) — current scroll position
- `--yiz-viewport-percent` (0..1) — ratio of visible area to total content
- `--yiz-scroll-direction` (0=default, 1=RTL/reversed)

JS writes these as numbers on track elements via computed styles; CSS `calc()` positions the thumb:
```css
.yiz-scroll-box-thumb-v {
  top: calc(var(--yiz-scroll-percent) * 100%);
  transform: translateY(calc(var(--yiz-scroll-percent) * -100%));
  height: calc(var(--yiz-viewport-percent) * 100%);
}
```

**Pointer capture drag** — `setPointerCapture` on thumb `pointerdown`, `pointermove` calculates `deltaScroll = deltaPointer * contentSize / viewportSize`, cleanup on `pointerup`/`lostpointercapture`. Track click jumps to position proportionally.

**Auto-hide system** — four modes controlled by `autoHide` prop:
- `'never'` (default) — always visible when overflow exists
- `'scroll'` — show on scroll, hide after `autoHideDelay` ms
- `'move'` — show on pointermove over host, hide after delay
- `'leave'` — show on pointerenter, hide on pointerleave after delay

CSS classes `--active` (overflow exists), `--auto-hidden` (auto-hide hides), `--interacting` (drag/hover overrides hide) combine with `opacity`/`visibility` transitions. The `elementFromPoint` check in `pointerup` prevents interaction state from being cleared when the pointer is still over a track after drag.

**RTL support** — detected via `getComputedStyle('direction')`. The `--yiz-scroll-direction` custom property flips thumb positioning via a CSS calc formula: `directionalPercent = scrollPercent when direction=0, 1 - scrollPercent when direction=1`.

**Theme system** — CSS custom properties on `.yiz-scroll-box-track` (`--yiz-scroll-thumb-bg`, `--yiz-scroll-thumb-bg-hover`, `--yiz-scroll-thumb-bg-active`, `--yiz-scroll-thumb-radius`, `--yiz-scroll-track-size`, `--yiz-scroll-track-offset`, `--yiz-scroll-thumb-min-size`). Pass a class name via `theme` prop to override these.

**Observers** — `ResizeObserver` on viewport triggers `sync()` + auto-hide refresh. Scroll events on viewport drive the primary update cycle. Wheel events on scrollbar surfaces are forwarded to viewport via `e.preventDefault()` + manual `scrollTop`/`scrollLeft` adjustment.

**Key props:** `height`, `maxHeight`, `width` (number → px, string → passed as-is e.g. `'100%'`, `'calc(100vh - 80px)'`), `autoHide`, `autoHideDelay`, `theme`, `overflowX`, `overflowY`.

### Card (`scripts/card/`)

Content container with structured slots: `#cover` (full-width image area at top), `#title` / `#extra` (header left/right — `title` prop is string fallback when `#title` slot is omitted), `#default` (body), `#footer` (bottom, auto-adds `border-top`). Props: `bordered`, `shadow` (`'never' | 'hover' | 'always'`), `size` (`'default' | 'small'`). Pure layout component — no Teleport, no z-index.

### ButtonGroup (`scripts/button-group/`)

Flex container for grouping buttons. Props: `direction` (`'horizontal' | 'vertical'`), `size` (`'small' | 'default' | 'large'` or a number for gap in px), `align`, `wrap`. Styled via `--yiz-button-group-gap` and `--yiz-button-group-align` CSS custom properties. Simple slot container, no provide/inject.

### Click-outside and document listeners

Select and Dialog/Drawer register document-level event listeners on mount and remove them on unmount:
- **Select** — document `click` (capture), document `keydown`, window `resize`
- **Dialog/Drawer** — document `keydown` (Escape to close)

Always pair `onMounted` listeners with corresponding `onBeforeUnmount` cleanup.

## Conventions

- No semicolons, single quotes, 120-char print width, trailing commas disabled (see `.prettierrc`)
- Components use `<script setup lang="ts">` with typed props via `defineProps` / `withDefaults`
- Slots are typed with `defineSlots`
- v-model uses `defineModel` (Vue 3.4+)
- Styles are non-scoped Less, namespaced with `yiz-` prefix
- Components that share state use `provide`/`inject` with a string key prefixed `yiz` (e.g. `'yizCheckboxGroup'`)
- Overlay components (Dialog, Drawer, Select) use `<Teleport to="body">` with `scripts/zIndex.ts` for stacking
- Components that need to expose methods to parents use `defineExpose({ focus, ... })` (see InputNumber)
- Document event listeners registered in `onMounted` must be cleaned up in `onBeforeUnmount`
