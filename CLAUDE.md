# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`yiz-ui` is a Vue 3 UI component library. Components live in `scripts/`, and a Vite-powered demo app in `site/` is used for development.

## Commands

```bash
# Install dependencies (Yarn Classic 1.x)
yarn

# Start the demo/dev server
yarn dev

# Build the demo site for deployment
yarn site:build

# Type-check the entire project (no emit)
yarn typecheck

# Build the library (Vite + vue-tsc declarations)
yarn build
```

There are currently no test or lint scripts configured. ESLint and Prettier are installed as devDependencies but have no project-level config files (Prettier config is in `.prettierrc`).

**Package manager:** Yarn Classic (1.22.22 per Volta). Node version: 25.9.0 (Volta). Do not use `npm` or `yarn dlx` — use `yarn` for all package operations.

**Build output:** `yarn build` produces dual CJS/ESM output in `dist/` (`yiz-ui.cjs`, `yiz-ui.mjs`, `index.d.ts`, `yiz-ui.css`). Never edit files in `dist/` — it is generated output.

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
3. Create `site/pages/<Name>Demo.vue`
4. Register the demo page in `site/App.vue`: add import, `pages` entry, and `menuItems` entry

Everything else (plugin registration, path alias, global component name) is automatic.

### i18n / Locale system (`scripts/locale/`)

A simple reactive i18n system. Key exports from `scripts/locale/index.ts`:

- **`$t(key, params?)`** — translate a key with `{placeholder}` interpolation. Falls back to `zh-CN` if the key is missing in the current language, then to the raw key.
- **`$tList(key)`** — translate a key that holds a `string[]` (used for weekday names, etc.)
- **`setLang(lang)`** — switch the active language; falls back to `zh-CN` if the language isn't registered
- **`registerLang(lang, messages)`** — register a full language message object
- **`registerLangItem(lang, messages)`** — merge partial messages into an existing language

Built-in languages: `zh-CN` (default, defined in `zh-CN.json`) and `en-US` (defined in `en-US.json`). The active language is a reactive `ref` — components calling `$t()` will re-render when it changes.

**Usage in components:**

```ts
import { $t } from '../locale'
const placeholderText = computed(() => props.placeholder ?? $t('select.placeholder'))
```

Components that display user-facing text (Empty, Pagination, Select, DatePicker, TimePicker, Table, Loading) use `$t()` for their default labels/placeholders. When adding a new component with text, add keys to both `zh-CN.json` and the demo's i18n registration.

**The demo app** (`site/i18n.ts`) registers its own UI strings via `registerLangItem('zh-CN', ...)` and `registerLangItem('en-US', ...)`, then calls `setLang()` with the demo's language selector.

### Notification imperative API (`scripts/notification/`)

Unlike most components, Notification is used **imperatively** via a function call, not declaratively in templates:

```ts
import { notification } from 'yiz-ui'

// Basic usage
notification({ title: 'Success', content: 'Operation completed.', type: 'success' })

// Convenience methods
notification.info({ content: 'Info message' })
notification.success({ content: 'Success message' })
notification.warning({ content: 'Warning message' })
notification.error({ content: 'Error message' })

// Returns a handle for manual close
const handle = notification({ content: 'Loading...', duration: 0 })
handle.close()
```

**Implementation:** `notification.ts` uses `createVNode` + `render()` to mount `Notification.vue` instances onto dynamically created DOM containers. A **holder** element (one per `placement` corner) manages stacking — notifications stack with gap via CSS `margin` and height transitions. Each holder is `position: fixed` at `z-index: 3000` with `pointer-events: none` (children re-enable it). When all notifications in a holder are destroyed, the holder is removed from the DOM.

Key options: `title`, `content` (string or VNode), `type` (`'info' | 'success' | 'warning' | 'error'`), `placement` (`'top-right'` | `'top-left'` | `'bottom-right'` | `'bottom-left'`), `duration` (ms, 0 = no auto-close), `closable`, `showIcon`, `width`, `onClose` callback.

### Table component (`scripts/table/`)

The most complex component. Three files:

- **`Table.vue`** — main SFC using separate CSS Grid header/body/footer structures with synchronized column templates. Flex column layout fills parent height (no `height` prop). Features: local/remote sorting, column resize with min/max constraints, single/multi selection (v-model via `defineModel`), row-level select disabling (`selectDisabled`), `select` event (emits full row data), row numbers, empty/loading slots, fixed columns with sticky positioning, and multi-row footers.
- **`TableColumn.vue`** — renderless declarative component; declares column config via props (`label`, `field`, `width`, `sortable`, `align`, `minWidth`, `maxWidth`, `fixed`, `formatter`). Supports a `#default` slot for custom cell rendering.
- **Dynamic presentation:** `Table` exposes `rowClass`, `rowStyle`, `cellClass`, and `cellStyle`; `TableColumn` exposes `cellClass`, `cellStyle`, `headerClass`, and `headerStyle`. Resolvers receive exported row/cell/header contexts. Data-cell rules declared on `Table` merge after column-local rules, while sticky positioning and grid layout styles remain internally controlled. Row backgrounds live on `.yiz-table-row`, and body cells inherit them so stripe, hover, fixed columns, and custom row backgrounds stay consistent.
- Table column pixel dimensions accept numbers, numeric strings, and `px` strings. Values are normalized to pixels; invalid or negative values are treated as omitted.
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

**Footer rows:** Enable with `show-footer` and provide `footer-method`, which receives the current rendered data plus business columns and returns `TableFooterRow[]`. Each row maps values through `cells: Record<field, value>`, so selection, row-number, gap, and reordered fixed columns cannot shift footer values. The footer stays below the vertical scroll area, shares the header/body grid template and sticky offsets, and exposes `#footer-cell` for custom rendering.

**Sorting:** `sortMode` defaults to `'local'`, where the table sorts a copied data array. In `'remote'` mode, clicks only update the sort indicator and emit `sort-change`; the parent replaces `data` after its request. The optional `v-model:sort` uses `{ field, order: 'asc' | 'desc' } | null`; without a binding, the model falls back to internal state so the three-step ascending/descending/cleared cycle still works.

**Key props on `y-table`:** `data`, `bordered`, `stripe`, `size`, `resize`, `no`, `selectMode`, `sortMode`, `rowKey`, `selectDisabled`, `loading`, `showFooter`, `footerMethod`, `v-model:selected`, `v-model:sort`. The root-level loading mask covers the header, body, and footer; `#loading` replaces its default indicator. `#footer-cell` customizes footer cell rendering.

**Key events:** `select` — fires when selection changes, payload is the selected row data (single object for single mode, array for multi mode, null when deselected in single mode). `row-dblclick` — fires when a data row is double-clicked with `(row, displayIndex, MouseEvent)`. `sort-change` — fires only for user-triggered sort changes with `TableSortState | null`; programmatic model updates do not emit it.

**Body scrolling with ScrollBox:** The body area uses `<ScrollBox ref="bodyScrollBoxRef" :z-index="4" @scroll="onBodyScroll">`. Header and footer horizontal sync read `bodyScrollBoxRef.value.viewport.scrollLeft` (exposed via `defineExpose`). The `:z-index="4"` ensures scrollbar tracks render above fixed columns (z-index 2–3). `bodyContentShort` tracks whether body content is shorter than the viewport to control the last row's bottom border.

**Last row border logic:** For bordered tables, the last body row omits its bottom border by default. When `bodyContentShort` is true, `.yiz-table-body-short` restores it; when content reaches or exceeds the viewport, the ScrollBox host's bottom border provides the visual closure instead.

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

Number input with increment/decrement buttons. Uses `defineModel<number | null>('modelValue')` — null represents empty input. Props: `min`, `max`, `step`, `precision`, `controls` (show +/- buttons), `prefix`/`suffix` (text or slots), `align`. Supports ArrowUp/ArrowDown keyboard shortcuts and Enter key (`pressEnter` event). Uses `defineExpose({ focus, blur })` to expose focus control methods to parents. Hides native spinner buttons via `-webkit-appearance: none` / `-moz-appearance: textfield`.

### Icon (`scripts/icon/`)

Renders a Vue component (via `:is`) with 1em-based `width`/`height`. Use the `size` prop to set an explicit `font-size` in px. `display: inline-block` so it behaves like an inline icon; wrap in a flex container when vertical centering is needed.

**`renderSvg`** (`scripts/icon/renderSvg.ts`) — utility that converts an SVG string into a Vue component for use with `<y-icon>`. Exported from `scripts/index.ts`.

### Tooltip (`scripts/tooltip/`)

Hover-triggered tooltip with `placement` (`top` | `bottom` | `left` | `right`), CSS arrow border trick, and `<Transition name="yiz-tooltip-fade">`. Content via `content` prop or `#content` slot. Uses a hardcoded `z-index: 2000` (does NOT use `nextZIndex()` — it's positioned `absolute` relative to the trigger, not Teleported).

### Tab (`scripts/tab/`)

- **`Tab.vue`** — main container using slot-based child extraction to find `TabPane` children. Extracts `label`, `value`, `disabled` props from each pane, renders a header row with a sliding active indicator bar, and renders the default slot (which TabPane children control via `v-show`). Uses `v-model:active` (`defineModel`), emits `select` event. Card tabs keep an internal closed-key set for unmanaged panes; when the parent removes a pane, its closed key is released synchronously so the same key can be mounted again later.
- **`TabPane.vue`** — renderless child that declares `label` / `value` / `disabled` props and a default slot for content. Injects `'yizTab'` context and uses `v-show` to toggle visibility based on whether its `value` matches the parent's `active`.

### Tag (`scripts/tag/`)

Small label/tag component with preset colors and custom hex color support. Props: `color` (`'default' | 'primary' | 'success' | 'warning' | 'error'` or a `#rgb` / `#rrggbb` hex string — hex values use `@ctrl/tinycolor` to derive `--yiz-tag-*` CSS custom properties for background, text, border, and close-button hover), `mode` (`'filled' | 'solid' | 'outlined'`, default `outlined`), `closable` (renders an inline SVG close icon, emits `close`), `checkable` (toggles `v-model:checked` on click or Enter/Space and takes priority over `closable`; unchecked state is borderless white, checked state uses `color` or primary by default), `disabled` (only affects checkable mode, blocks mouse/keyboard changes while preserving checked appearance), `size` (`'default' | 'small' | 'large'`). Emits `change(checked)` when a checkable tag toggles. Default slot for tag content.

### Ripple wave animation

Button (except `filled` and `text`), Checkbox, Radio, and Switch share a ripple wave effect. The `yiz-wave` span uses CSS keyframes `yiz-wave-spread` and `yiz-wave-opacity` defined in `scripts/style.less`. The effect is triggered by briefly adding/removing the `yiz-wave` element via a `ref` toggle with a `nextTick` → `setTimeout` pattern.

### Native input overlay pattern

Checkbox, Radio, and Switch hide a native `<input>` behind a styled `<span>` (the visual indicator). The native input is made transparent but remains interactive for accessibility. This avoids custom keyboard/ARIA handling.

### Theming

All design tokens are CSS custom properties defined in `scripts/style.less`, prefixed with `--yiz-`. The palette includes primary, success, warning, and error color scales (each with light/heavy variants). Component size typography uses `--yiz-font-size-small` (12px), `--yiz-font-size-default` (14px), and `--yiz-font-size-large` (16px). Individual components reference these tokens and can also accept arbitrary hex colors at runtime via `@ctrl/tinycolor` manipulation applied to inline `--yiz-button-color-*` custom properties.

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

Menu, ContextMenu, and Select mirror Table's slot-based child extraction pattern. Menu uses the renderless `MenuItem` and `MenuDivider` components; ContextMenu and Select use `ContextMenuOption` and `SelectOption`. Their props and default slot functions are extracted via `useSlots()`:

```ts
const slotItems = computed(() => {
  const nodes = slots.default?.() ?? []
  // iterate VNodes, match on child component type, extract props
  for (const vnode of nodes) {
    if (vnode.type === MenuItemComp && vnode.props) { ... }
  }
})
```

The `allItems` computed falls back to the `items` prop when no slot children are provided. Both APIs coexist — consumers can nest `<y-menu-item>` children, insert `<y-menu-divider name="...">`, or use `:items` with `MenuEntry[]` data.

### Menu and ContextMenu

Both components share the same architecture:

- **`Menu.vue`** — main SFC rendering items with select/expand logic. Delegates submenus to `SubMenu` (inline expand) and `PopupSubMenu` (teleported popups).
- **`SubMenu.vue`** (`scripts/menu/SubMenu.vue`) — renders items directly with expand/collapse and slide `<Transition>`. Recursively renders nested `SubMenu` for children. Owns its own `expandedKeys` state.
- **`PopupSubMenu.vue`** (`scripts/menu/PopupSubMenu.vue`) — renders items directly in a `<Teleport>`-ed popup. Handles recursive nested hover popups with edge detection. Owns its own hover/timer state.
- **`MenuItem.vue` / `MenuDivider.vue` / `ContextMenuOption.vue`** — renderless declarative children for slot-based usage
- **`IconRenderer.vue`** (`scripts/menu/IconRenderer.vue`) — shared internal utility that renders icon VNodes; used by both Menu and ContextMenu

**Menu modes:**

- **Default** — sidebar with expandable submenus (inline expand/collapse with `<Transition>`)
- **`collapsed`** — sidebar collapsed to icon-only width (56px); childless items wrap in `<Tooltip>`; items with children show Teleported popups at `z-index: 3000`

Menu entries use the `MenuEntry` union (`MenuItemOption | MenuDividerOption`). Dividers render in the main menu, inline submenus, and collapsed popup submenus; their optional `name` appears as a muted group label on its own row above the horizontal rule.

**ContextMenu item types** — ContextMenu supports five item `type` values: `item`, `divider`, `submenu`, `checkbox`, and `radiogroup`. The `checkbox` and `radiogroup` types are unique to ContextMenu (not in Menu). Checkbox items maintain a `checkedValues: Set<any>` so multiple can be toggled independently. Radiogroup items use `name` to group selections and store the active value in `radioValues: Map<string, any>`. Both emit `select` with the item + a `checked` boolean.

**ContextMenu submenus** — nested submenus render inline and position with `position: absolute; left: 100%`. Submenu placement flips to `right: 100%` when the submenu would overflow the viewport right edge, and flips vertically when it would overflow the bottom.

**ContextMenu imperative API** — unlike Menu (which is used declaratively in templates), ContextMenu also exposes `showContextMenu(options, event)` as an imperative function from `scripts/context-menu/index.ts`. It follows the same `createVNode` + `render()` pattern as Notification, mounting a ContextMenu instance at the pointer position on right-click or at a specified event target.

**v-model:select:** Menu uses `defineModel<any>('select')` to track the currently selected item value.

### Select

A dropdown selection component combining several patterns:

- **Teleported dropdown** — `<Teleport to="body">` with `position: fixed` positioned via `getBoundingClientRect()` on the trigger element
- **z-index** — calls `nextZIndex()` on open, dropdown renders at `zIndex + 1`
- **Click-outside** — document-level `click` listener (capture phase) closes the dropdown when clicking outside trigger + dropdown refs
- **Keyboard** — Escape to close, ArrowUp/ArrowDown to navigate `hoverIndex`, Enter to select
- **Search** — optional `search` prop (sync or async function returning filtered `SelectOption[]`); renders an `<Input>` in the dropdown. Search input is fixed outside the ScrollBox so it doesn't scroll with options.
- **`defineModel`** — `defineModel<any>('value')` tracks the selected value or value array
- **Multiple selection** — `multiple` switches `v-model:value` to an array and keeps the dropdown open while toggling options. Optional `max` limits new selections; once reached, unselected options are disabled while selected options remain available for deselection.

**Options scrolling:** The options list is wrapped in `<ScrollBox :max-height="scrollBoxMaxHeight">`. `scrollBoxMaxHeight` is a ref (default 240) dynamically adjusted by `repositionDropdown()` based on available viewport space minus search bar height. The search input sits outside the ScrollBox, staying fixed at the top of the dropdown.

**Positioning:** `repositionDropdown()` is the central position function, called on open (via `watch(open)` + `nextTick`) and on window `scroll`/`resize`. It decides below-vs-above by comparing `spaceBelow` vs `spaceAbove`, writes position to `dropdownPos` (a reactive ref), which `dropdownStyle` computed spreads into the style binding. Upward popups use `bottom` CSS (not `top`) so the dropdown's bottom edge automatically aligns to the trigger's top edge without manual height calculation. The `scroll` listener uses capture phase (`true`) because scroll events don't bubble.

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

**Observers** — `ResizeObserver` on viewport triggers `sync()` + auto-hide refresh. `MutationObserver` on viewport (childList, subtree, characterData, attributes) detects content changes (dynamic content, images loading, column resize) and schedules a rAF-coalesced `sync()`. Scroll events on viewport drive the primary update cycle. Wheel events on scrollbar surfaces are forwarded to viewport via `e.preventDefault()` + manual `scrollTop`/`scrollLeft` adjustment.

**External API** — `defineExpose({ viewport, sync })` exposes the viewport ref for external scroll position reading and manual sync. `emit('scroll', event)` fires on scroll for parent components to react (e.g. Table's header sync).

**Key props:** `height`, `maxHeight`, `width` (number → px, string → passed as-is e.g. `'100%'`, `'calc(100vh - 80px)'`), `autoHide`, `autoHideDelay`, `theme`, `overflowX`, `overflowY`, `zIndex` (default 1, sets scrollbar track z-index for stacking context priority).

### Card (`scripts/card/`)

Content container with structured slots: `#cover` (full-width image area at top), `#title` / `#extra` (header left/right — `title` prop is string fallback when `#title` slot is omitted), `#default` (body), `#footer` (bottom, auto-adds `border-top`). Props: `bordered`, `shadow` (`'never' | 'hover' | 'always'`), `size` (`'default' | 'small'`). Pure layout component — no Teleport, no z-index.

### ButtonGroup (`scripts/button-group/`)

Flex container for grouping buttons. Props: `direction` (`'horizontal' | 'vertical'`), `size` (`'small' | 'default' | 'large'` or a number for gap in px), `align`, `wrap`. Styled via `--yiz-button-group-gap` and `--yiz-button-group-align` CSS custom properties. Simple slot container, no provide/inject.

### Divider (`scripts/divider/`)

Content separator with horizontal and vertical modes. Props: `direction` (`'horizontal' | 'vertical'`), `dashed` (boolean), `text` (string — displayed in the middle of the line). Pure layout component — no Teleport, no z-index.

### Dropmenu (`scripts/dropmenu/`)

Dropdown menu triggered by a click on a cloned trigger VNode. Renders a recursive `DropmenuPanel` in a Teleported popup positioned via `getBoundingClientRect()` relative to the trigger. Follows the same Teleport + `nextZIndex()` + click-outside + scroll/resize reposition pattern as Select. Supports both the `options` prop and `<y-dropmenu-item>` slot children, including `{ type: 'divider' }` separators and nested `children`. Emits `select` and supports keyboard navigation between enabled items.

### Popconfirm (`scripts/popconfirm/`)

Confirmation popup composed on top of `Popover`, preserving its renderless cloned trigger, Teleport positioning, dynamic `nextZIndex()`, and nested `overlayScope` behavior. It can therefore render above Dialog/Drawer and remain interactive inside an outer Popover; overlays opened inside its description are registered with the Popover scope. Overlay scopes form a parent/child tree, so ancestors recognize Teleported elements from arbitrarily deep descendants (for example Popover → Popconfirm → Select). Supports controlled `v-model:open`, confirm/cancel events, external `confirmLoading`, and an async `beforeConfirm` guard that keeps the popup open on `false` or rejection.

### Button (`scripts/button/`)

The foundational interactive component. Props: `type` (`'outlined' | 'primary' | 'plain' | 'dash' | 'filled' | 'text'`, default `outlined`), `color` (`'default' | 'success' | 'warning' | 'error'` or a `#rrggbb` hex string), `shape` (`'default' | 'round' | 'circle'`), `size`, `disabled`. `dash` mirrors `outlined` with a dashed border; `filled` mirrors `plain` without a visible border or wave; `text` uses a transparent background and the filled background on hover, also without wave. When `color` is a hex string, `@ctrl/tinycolor` derives `--yiz-button-color-*` CSS custom properties for hover/press/disabled states. Text children are automatically wrapped in `<span>` for proper flex alignment alongside icons. Emits `click` and exposes `focus()` and `blur()`.

### Input (`scripts/input/`)

Text input with `v-model:value` (`defineModel`), `placeholder`, `prefix`/`suffix` (string props or `#prefix`/`#suffix` slots — props take priority), `clearable` (renders a clear button using `@vicons/fluent` `DismissCircle32Filled` via `Icon`), and focus ring styling. Emits `pressEnter` on Enter key. Exposes `focus()` and `blur()` via `defineExpose`.

### Empty (`scripts/empty/`)

Placeholder for empty states. Slots: `#image` (default is an inline SVG illustration), `#description` (falls back to `$t('common.noData')`), `#default` (footer actions). Props: `description` (string override), `size` (`'default' | 'small'`). Uses `$t()` from the locale system.

### ColorPicker (`scripts/color-picker/`)

HSV color picker with a Teleported dropdown panel. Follows the same Teleport + `nextZIndex()` + click-outside + scroll/resize reposition pattern as Select. Features: saturation/brightness panel (2D gradient), hue slider, optional alpha channel, hex input field (uses project's `Input` component), preset color swatches, and confirm/cancel actions. Mouse drag for panel, hue, and alpha via `document` mousemove/mouseup listeners (cleaned up in `onBeforeUnmount`). Internal color conversion: hex ↔ HSV. Uses `defineModel<string>('value')`.

### DatePicker and DateRangePicker (`scripts/date-picker/`, `scripts/date-range-picker/`)

Date selection with a Teleported calendar panel. Features: month/year navigation with double-arrow fast-forward, year grid quick-select, today marker, date disabling (via `disabledDate` function prop), clearable input. Follows the Select dropdown pattern (Teleport, `nextZIndex()`, click-outside, scroll/resize reposition). Uses `$t()` for i18n (weekday names, month labels, placeholders). **DateRangePicker** has two independent v-model bindings (`v-model:start`, `v-model:end`) and allows single-side empty when `required` is false. When both dates are set, auto-sorts so start ≤ end (unless `autoSort` is false).

### TimePicker and TimeRangePicker (`scripts/time-picker/`, `scripts/time-range-picker/`)

Time selection with a Teleported column-based panel (hour / minute / optional seconds columns). Each column is a scrollable list of values; clicking selects. Footer has a "now" `LinkButton` and a confirm `Button`. Uses `$t()` for i18n (column headers, placeholder). **TimeRangePicker** has two independent v-model bindings (`v-model:start`, `v-model:end`) with the same single-side-empty and auto-sort semantics as DateRangePicker.

### Tree (`scripts/tree/`)

Hierarchical data display using recursive `TreeNode` components. Uses `provide('yizTree', { ... })` so any level of TreeNode can access tree state. The TreeContext includes: `indent`, `checkable`, `selectable`, `expandOnClickNode`, plus functions: `isExpanded`, `isSelected`, `isChecked`, `isHalfChecked`, `toggleExpand`, `selectNode`, `toggleCheck`. Props: `data` (`TreeNodeData[]` — each node has `label`, `key`, optional `children`, `disabled`, `selectable`, `checkable`), `checkable`, `selectable`, `defaultExpandAll`, `expandOnClickNode`, `indent`, `emptyText`. v-model: `v-model:selected` (single key), `v-model:checked` (key array), `v-model:expanded` (key array). Scoped slots: `before` and `after`, both receiving `{ item, selected, checked }` for every recursive node. Emits: `select`, `check`, `expand`. Half-checked state: a parent is half-checked when some (but not all) of its checkable descendants are checked and the parent itself is not checked. Expand/collapse uses a CSS height transition.

### Pagination (`scripts/pagination/`)

Page navigation with computed pager items (ellipsis logic for large page counts). Uses two `defineModel` bindings: `v-model:page` and `v-model:pageSize`. Props: `total`, `pageSizes` (array, used as options in an embedded `Select`), `pagerCount` (must be odd, defaults to 7), `showTotal`, `showSizeChanger`, `showQuickJumper`, `disabled`, `simple` (compact mode with a page input), `size`. Emits: `change(page, pageSize)`, `pageSizeChange(pageSize)`. Uses `$t()` for i18n (total label, page size labels, aria labels, jumper text).

### RadioButton and RadioButtonGroup (`scripts/radio-button/`, `scripts/radio-button-group/`)

Button-style radio selection. `RadioButton` uses the native input overlay pattern (hidden `<input type="radio">`). Supports standalone `v-model` or group mode via `inject('yizRadioButtonGroup')`, with string, number, or boolean option values. `RadioButtonGroup` provides `{ modelValue, disabled, size, changeValue }` and renders children in a flex row. Props on the group: `size` (`'small' | 'default' | 'large'`), `disabled`.

### Dialog drag and Drawer resize

**Dialog** supports a `drag` prop — when enabled, the header is draggable (`mousedown` on header → `document` mousemove/mouseup to update `transform: translate()`). Drag is constrained to the viewport; position auto-corrects on window resize.

**Drawer** supports a `resize` prop with `resizeMin`/`resizeMax` constraints. A resize handle at the edge of the drawer uses `mousedown` → `document` mousemove/mouseup to adjust width (for left/right placement) or height (for top/bottom placement). The handle uses `setPointerCapture` for reliable tracking.

### Encoding rules (from AGENTS.md)

- All source files use **UTF-8 without BOM**. Never use GBK or ANSI.
- When reading/writing files, explicitly use UTF-8 encoding.
- Never rewrite garbled Chinese text — verify the encoding of your read first.
- If terminal output shows garbled Chinese, that's a terminal encoding issue, not a file encoding issue.

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
- Input-like components expose `focus()` and `blur()` through `defineExpose`; range pickers additionally accept `focus('start' | 'end')`
- Input, InputNumber, Textarea, Select, ColorPicker, and date/time pickers support `readonly`; readonly controls remain focusable but cannot clear, edit, or open a selection panel
- Input-like components support `styleMode="outlined" | "filled"` (default `outlined`). `InputGroup` exposes the same prop and overrides the style mode declared by descendant input controls.
- Document event listeners registered in `onMounted` must be cleaned up in `onBeforeUnmount`
