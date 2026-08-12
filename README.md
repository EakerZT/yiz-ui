<p align="center">
  <h1 align="center">Yiz UI</h1>
</p>

<p align="center">
  A clean, lightweight, and practical Vue 3 component library built with TypeScript.
</p>

<p align="center">
  English | <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/EakerZT/yiz-ui"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://www.npmjs.com/package/@eakerzt/yiz-ui"><img src="https://img.shields.io/npm/v/@eakerzt/yiz-ui" alt="npm"></a>
</p>

---

## Features

- **50+ components** for forms, data display, navigation, feedback, and common application workflows.
- **TypeScript first** with strict-mode development and type-friendly component APIs.
- **Vue 3.4+** with `defineModel`, `<script setup>`, and modern Vue patterns.
- **CSS variable theming** via `--yiz-*` custom properties.
- **Built-in i18n** with Chinese and English, plus runtime language extension APIs.
- **Tree shakable** component exports for on-demand usage.
- **Utility APIs** for messages, dialogs, modal layer management, notifications, context menus, loading bars, and typed event emitters.

## Installation

```bash
npm install @eakerzt/yiz-ui
# or
yarn add @eakerzt/yiz-ui
# or
pnpm add @eakerzt/yiz-ui
```

**Peer dependency:**

| Dependency | Version  |
| :--------- | :------- |
| vue        | >= 3.4.0 |

## Documentation

- [Online demo](https://eakerzt.github.io/yiz-ui/)
- [Changelog](update.md)

## Quick Start

Add the global stylesheet and install the plugin:

```ts
import { createApp } from 'vue'
import yiz from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
import App from './App.vue'

const app = createApp(App)
app.use(yiz)
app.mount('#app')
```

After full registration, all components are available with a `Y` prefix:

```vue
<template>
  <y-button type="primary" @click="handleClick">Click</y-button>
  <y-input v-model:value="text" placeholder="Please input" />
  <y-table :data="list">
    <y-table-column label="Name" field="name" />
    <y-table-column label="Age" field="age" />
  </y-table>
</template>
```

### Global CSS Prerequisite

Some component dimensions rely on `border-box`. Add this rule to your application's global stylesheet before using the components:

```css
* {
  box-sizing: border-box;
}
```

### Design Tokens

YIZ UI exposes layered CSS custom properties on `:root`. Override semantic tokens after importing the library stylesheet to create a desktop theme without editing component styles:

```css
:root {
  --yiz-color-primary: #7c3aed;
  --yiz-color-text-primary: #1f2937;
  --yiz-color-bg-container: #ffffff;
  --yiz-control-height-default: 34px;
  --yiz-radius-default: 6px;
  --yiz-shadow-popup: 0 8px 24px rgba(15, 23, 42, 0.12);
  --yiz-motion-duration-default: 0.18s;
}
```

The public token groups are:

- Color: `--yiz-color-{primary|success|warning|error}-*`, `--yiz-color-text-*`, `--yiz-color-bg-*`, `--yiz-color-border-*`, and `--yiz-color-mask`.
- Size and spacing: `--yiz-control-height-*`, `--yiz-control-padding-x-*`, `--yiz-icon-size-*`, and `--yiz-space-*`.
- Shape and type: `--yiz-radius-*`, `--yiz-font-size-*`, `--yiz-font-weight-*`, and `--yiz-line-height-*`.
- Elevation and interaction: `--yiz-shadow-*`, `--yiz-motion-*`, `--yiz-control-*-shadow`, and `--yiz-focus-ring-color`.

The old misspelled `--yiz-color-*-heary*` variables remain as compatibility aliases. New themes should use `--yiz-color-*-dark*`.

### On-Demand Import

```ts
import { Button, Input, Table, TableColumn } from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
```

```vue
<template>
  <Button type="primary">Button</Button>
  <Input v-model:value="text" />
  <Table :data="list">
    <TableColumn label="Name" field="name" />
    <TableColumn label="Age" field="age" />
  </Table>
</template>
```

## Utility APIs

### Message

```ts
import { message } from '@eakerzt/yiz-ui'

message('Operation completed')
message.success('Saved successfully')
message.warning('Please check the form')
message.error('Operation failed')

message.loading({ key: 'save', content: 'Saving...' })
message.success({ key: 'save', content: 'Saved', duration: 2000 })

message.destroy()
```

### Dialog.confirm

```ts
import { Dialog } from '@eakerzt/yiz-ui'

Dialog.confirm({
  title: 'Confirm this action?',
  content: 'This action takes effect immediately. Continue?',
  onOk: async () => {
    await submit()
  },
})
```

`onOk` can return a Promise to show loading on the OK button. Return `false` to keep the confirm dialog open.

For projects that use modal layer management, prefer `useDialog()` so confirm dialogs inherit the current layer:

```ts
import { useDialog } from '@eakerzt/yiz-ui'

const dialog = useDialog()

dialog.confirm({
  title: 'Confirm this action?',
  content: 'This confirm belongs to the current modal layer.',
})
```

### LayerManager

```ts
import { useModalLayer, useModalLayerManager } from '@eakerzt/yiz-ui'

const rootLayer = useModalLayer()
rootLayer.active()

const manager = useModalLayerManager()

window.addEventListener('keydown', (event) => {
  if (!manager.isTopLayer.value) return
  // root-layer shortcuts
})
```

`Dialog`, `Drawer`, and `useDialog().confirm()` join the modal layer stack when a parent layer exists. If no parent layer is provided, they keep their normal behavior and ignore layer management.

### Notification

```ts
import { notification } from '@eakerzt/yiz-ui'

notification({ title: 'Success', content: 'Operation completed', type: 'success' })

notification.info({ content: 'Information' })
notification.success({ content: 'Success' })
notification.warning({ content: 'Warning' })
notification.error({ content: 'Error' })

const handle = notification({ content: 'Loading...', duration: 0 })
handle.close()
```

### LoadingBar

```ts
import { loadingBar } from '@eakerzt/yiz-ui'

loadingBar.start()
loadingBar.done()
loadingBar.fail()

loadingBar.set(0.4)
loadingBar.inc()
loadingBar.dec()
loadingBar.pause()
loadingBar.resume()

loadingBar.configure({ color: '#52c41a', height: '3px', indeterminate: true, direction: 'rtl' })
loadingBar.reset()
```

The default color follows `--yiz-color-primary`; `fail()` uses `--yiz-color-error`. Indeterminate mode (`indeterminate: true`) shows an animated sliding bar without a percentage value.

### ContextMenu

```ts
import { useContextMenu } from '@eakerzt/yiz-ui'

const contextMenu = useContextMenu()
const handle = contextMenu.open({
  x: event.clientX,
  y: event.clientY,
  width: 200,
  menus: [
    { type: 'item', label: 'Refresh', value: 'refresh' },
    { type: 'divider' },
    { type: 'item', label: 'Delete', value: 'delete', disabled: true },
  ],
  onSelect: (item) => console.log(item.value),
  onClose: () => console.log('closed'),
})

handle.close()
```

### Emitter

```ts
import { createEmitter, emitter, useEmitter } from '@eakerzt/yiz-ui'

type FormEvents = {
  change: [value: string]
  submit: [data: FormData, valid: boolean]
  reset: []
}

const off = emitter.on('notify', (message) => {
  console.log(message)
})
emitter.emit('notify', 'Saved')
off()

export const formEmitter = createEmitter<FormEvents>('form')
formEmitter.emit('submit', new FormData(), true)

const { emit, emitAsync, on, once, off: offEvent, clear, count } = useEmitter<FormEvents>('form')

on('change', (value) => {
  console.log(value)
})

once('reset', () => {
  console.log('reset once')
})

emit('change', 'draft')
await emitAsync('submit', new FormData(), true)

offEvent('change')
clear('change')
console.log(count('change'))
```

`createEmitter()` without a name creates an isolated emitter. `createEmitter(name)` registers a named shared emitter and throws on duplicate names. `useEmitter(name)` only works for an existing named emitter and must be called inside a Vue setup or effect scope.

## Components

| Component           | Tag                                                | Description                                                       |
| :------------------ | :------------------------------------------------- | :---------------------------------------------------------------- |
| Breadcrumb          | `YBreadcrumb`                                      | Breadcrumb navigation with item data or declarative items         |
| BreadcrumbItem      | `YBreadcrumbItem`                                  | Declarative breadcrumb item                                       |
| Button              | `YButton`                                          | Button with type, color, shape, loading, and wave animation       |
| ButtonGroup         | `YButtonGroup`                                     | Horizontal or vertical button grouping                            |
| Card                | `YCard`                                            | Structured content container                                      |
| Checkbox            | `YCheckbox`                                        | Single checkbox                                                   |
| CheckboxGroup       | `YCheckboxGroup`                                   | Checkbox group with provide/inject state                          |
| Collapse            | `YCollapse`                                        | Collapsible panels with accordion mode and height animation       |
| CollapseItem        | `YCollapseItem`                                    | Collapse panel item with title and extra slots                    |
| ColorPicker         | `YColorPicker`                                     | HSV color picker with presets                                     |
| DatePicker          | `YDatePicker`                                      | Date picker with month/year navigation                            |
| DateRangePicker     | `YDateRangePicker`                                 | Date range picker with optional auto sorting                      |
| DateTimePicker      | `YDateTimePicker` / `y-datetime-picker`            | Date and time picker                                              |
| DateTimeRangePicker | `YDateTimeRangePicker` / `y-datetime-range-picker` | Date-time range picker                                            |
| Descriptions        | `YDescriptions`                                    | Description list with bordered, vertical, and column layouts      |
| DescriptionItem     | `YDescriptionItem`                                 | Declarative description item                                      |
| Dialog              | `YDialog`                                          | Dialog with drag, Escape support, confirm API, and layer support  |
| Divider             | `YDivider`                                         | Horizontal/vertical divider with dashed and text modes            |
| Drawer              | `YDrawer`                                          | Drawer with four placements and resizable size                    |
| Dropmenu            | `YDropmenu`                                        | Dropdown menu based on menu item extraction                       |
| DropmenuItem        | `YDropmenuItem`                                    | Declarative dropdown menu item                                    |
| Empty               | `YEmpty`                                           | Empty state with custom icon and text                             |
| Form                | `YForm`                                            | Form layout, validation, and reset                                |
| FormItem            | `YFormItem`                                        | Form item with label, required marker, and errors                 |
| Icon                | `YIcon`                                            | Render Vue components as icons                                    |
| Info                | `YInfo`                                            | Inline status text with preset info types                         |
| Input               | `YInput`                                           | Input with prefix/suffix and clearable support                    |
| InputCustom         | `YInputCustom`                                     | Input-like shell for custom or third-party logic                  |
| InputGroup          | `YInputGroup`                                      | Horizontal input grouping with addons and unified size            |
| InputNumber         | `YInputNumber`                                     | Numeric input with step controls and keyboard support             |
| InputPassword       | `YInputPassword`                                   | Password input with visibility toggle                             |
| LinkButton          | `YLinkButton`                                      | Text-style button                                                 |
| Loading             | `YLoading`                                         | Loading indicators and container loading mode                     |
| Menu                | `YMenu`                                            | Menu with expanded and collapsed modes                            |
| MenuDivider         | `YMenuDivider`                                     | Declarative menu group divider with an optional name              |
| MenuItem            | `YMenuItem`                                        | Declarative menu item with nested child support                   |
| Pagination          | `YPagination`                                      | Pagination with ellipsis, size changer, and quick jumper          |
| Popover             | `YPopover`                                         | Floating card with click, hover, focus, and controlled modes      |
| Progress            | `YProgress`                                        | Linear progress with status, custom color, and text formatting    |
| Radio               | `YRadio`                                           | Single radio                                                      |
| RadioGroup          | `YRadioGroup`                                      | Radio group with options and slots                                |
| RadioButton         | `YRadioButton`                                     | Radio as button                                                   |
| RadioButtonGroup    | `YRadioButtonGroup`                                | Button-style exclusive selection group                            |
| ScrollBox           | `YScrollBox`                                       | Custom scrollbar container with GPU positioning                   |
| Segmented           | `YSegmented`                                       | Segmented control with animated indicator                         |
| Select              | `YSelect`                                          | Select with search and keyboard navigation                        |
| SelectOption        | `YSelectOption`                                    | Declarative select option                                         |
| Slider              | `YSlider`                                          | Single/range slider with steps and marks                          |
| SortableBox         | `YSortableBox`                                     | Vue data-first drag sorting with cross-list preview               |
| Switch              | `YSwitch`                                          | Switch with loading and custom colors                             |
| Tab                 | `YTab`                                             | Tabs with four placements, card style, animation, and flex layout |
| TabPane             | `YTabPane`                                         | Tab pane with label slot and closable support                     |
| Table               | `YTable`                                           | Table with sorting, resize, selection, loading, and fixed columns |
| TableColumn         | `YTableColumn`                                     | Declarative table column with custom rendering                    |
| Tag                 | `YTag`                                             | Tag with preset/custom colors and closable support                |
| Textarea            | `YTextarea`                                        | Textarea with autosize, count, and clearable support              |
| TimePicker          | `YTimePicker`                                      | Time picker with hour/minute/second columns                       |
| TimeRangePicker     | `YTimeRangePicker`                                 | Time range picker with optional auto sorting                      |
| Timeline            | `YTimeline`                                        | Timeline with left/right/alternate modes                          |
| TimelineItem        | `YTimelineItem`                                    | Timeline item with title, time, type, and hollow node             |
| Tooltip             | `YTooltip`                                         | Tooltip with four placements and CSS arrow                        |
| Tree                | `YTree`                                            | Recursive tree with checkbox/radio and half-checked state         |
| Upload              | `YUpload`                                          | Slot-driven file picker with click, drag, multiple, and accept    |

## Size

Components with size variants use `small`, `default`, and `large` consistently.

```vue
<template>
  <y-button size="small">Small</y-button>
  <y-button size="default">Default</y-button>
  <y-button size="large">Large</y-button>

  <y-input v-model:value="text" size="large" />
  <y-select v-model:value="city" :options="cityOptions" size="small" />
</template>
```

Supported components include `Button`, `Card`, `ColorPicker`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `DateTimeRangePicker`, `Descriptions`, `Empty`, `Input`, `InputCustom`, `InputGroup`, `InputNumber`, `Loading`, `Pagination`, `RadioButton`, `RadioButtonGroup`, `Segmented`, `Select`, `Switch`, `Table`, `Tag`, `TimePicker`, `TimeRangePicker`, and `Timeline`.

`Button` uses `default` for the middle size. The old `middle` value is not supported.

`Icon.size` accepts a number or string value, not the three-level enum.

## Internationalization

Built-in languages:

- `zh-CN` (default)
- `en-US`

Switch language with `setLang()`. Components react automatically.

```ts
import { setLang, registerLang, registerLangItem, $t } from '@eakerzt/yiz-ui'

setLang('en-US')

registerLang('ja-JP', {
  'common.noData': 'データなし',
  'select.placeholder': '選択してください',
})

registerLangItem('zh-CN', {
  'myComponent.title': '我的组件',
})

const placeholder = computed(() => $t('select.placeholder'))
```

## Development

This repository uses Yarn Classic. Do not use `npm` or `pnpm` for repository development commands.

```bash
git clone https://github.com/EakerZT/yiz-ui.git
cd yiz-ui

yarn
yarn dev
yarn site:build
yarn typecheck
yarn format:check
yarn build
```

### Adding a New Component

1. Create `scripts/<name>/<Name>.vue` and `scripts/<name>/index.ts`.
2. Add `export * from './<name>'` to `scripts/components.ts` in alphabetical order.
3. Create `site/pages/<Name>Demo.vue`.
4. Register the demo page in `site/App.vue`.

Everything else, including plugin registration, path aliases, and global component names, is automatic.

### Planning Docs

- [SortableBox roadmap](plans/sortable-box-roadmap.md)

## Publishing

Package publishing is handled by GitHub Actions when a `v*` tag is pushed.

```bash
npm version patch # or minor / major
git push --follow-tags
```

The publish workflow runs `yarn install --frozen-lockfile`, `yarn typecheck`, `yarn build`, and `npm publish --access public`.

For local fallback publishing:

```bash
npm publish
```

`prepublishOnly` runs `yarn typecheck && yarn build` automatically before publishing.

## Acknowledgements

- [Sortable](https://github.com/SortableJS/Sortable) - `SortableBox` references its drag sorting behavior, event model, and edge handling.
- [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next) - `SortableBox` references its Vue component wrapper and data synchronization approach.
- [OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars) - `ScrollBox` references its custom scrollbar interaction and overlay scrolling experience.
- [BProgress](https://github.com/imskyleen/bprogress) - `LoadingBar` ports its core engine and references its progress state machine, trickle strategy, and positioning CSS.
- [EventEmitter3](https://github.com/primus/eventemitter3) - `Emitter` references its compact synchronous event model and hot-path performance ideas.
- [Emittery](https://github.com/sindresorhus/emittery) - `Emitter` references its explicit async emitting semantics and typed event API direction.
- [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) - `Emitter` references its small API surface and straightforward subscription model.

## License

[MIT](LICENSE)
