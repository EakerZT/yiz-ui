<p align="center">
  <h1 align="center">Yiz UI</h1>
</p>

<p align="center">
  A Vue 3 component library built with TypeScript. Clean, lightweight, and practical.
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

- **45+ components** covering forms, data display, navigation, feedback, and common application workflows.
- **TypeScript first** with strict-mode development and type-friendly component APIs.
- **CSS variable theming** via `--yiz-*` custom properties.
- **Built-in i18n** with Chinese and English, plus runtime language extension APIs.
- **Tree shakable**: import only what you use.
- **Vue 3.4+** with `defineModel`, `<script setup>`, and modern Vue patterns.
- **Imperative APIs** for notifications, context menus, and loading bars.

---

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
| vue        | >= 3.2.0 |

---

## Quick Start

### Global CSS Prerequisite

Add the following rule to your application's global stylesheet before using the components. Some component dimensions rely on `border-box`; without it, borders and padding may cause incorrect layout or sizing.

```css
* {
  box-sizing: border-box;
}
```

### Full Registration

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

```html
<template>
  <y-button type="primary" @click="handleClick">Click</y-button>
  <y-input v-model:value="text" placeholder="Please input" />
  <y-table :data="list">
    <y-table-column label="Name" field="name" />
    <y-table-column label="Age" field="age" />
  </y-table>
</template>
```

### On-Demand Import

```ts
import { Button, Input, Table, TableColumn } from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
```

```html
<template>
  <button type="primary">Button</button>
  <input v-model:value="text" />
  <table :data="list">
    <TableColumn label="Name" field="name" />
    <TableColumn label="Age" field="age" />
  </table>
</template>
```

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

### ContextMenu

```ts
import { showContextMenu } from '@eakerzt/yiz-ui'

showContextMenu(
  {
    items: [
      { type: 'item', label: 'Refresh', key: 'refresh' },
      { type: 'divider' },
      { type: 'item', label: 'Delete', key: 'delete', disabled: true },
    ],
    onSelect: (item) => console.log(item.key),
  },
  event,
)
```

`ContextMenu` supports `item`, `divider`, `submenu`, `checkbox`, and `radiogroup` item types. Nested submenus automatically flip near viewport edges.

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

---

## Components

| Component           | Tag                                                | Description                                                       |
| :------------------ | :------------------------------------------------- | :---------------------------------------------------------------- |
| Button              | `YButton`                                          | Button with type, color, shape, loading, and wave animation       |
| ButtonGroup         | `YButtonGroup`                                     | Horizontal or vertical button grouping                            |
| Card                | `YCard`                                            | Structured content container                                      |
| Checkbox            | `YCheckbox`                                        | Single checkbox                                                   |
| CheckboxGroup       | `YCheckboxGroup`                                   | Checkbox group with provide/inject state                          |
| ColorPicker         | `YColorPicker`                                     | HSV color picker with presets                                     |
| DatePicker          | `YDatePicker`                                      | Date picker with month/year navigation                            |
| DateRangePicker     | `YDateRangePicker`                                 | Date range picker with optional auto sorting                      |
| DateTimePicker      | `YDateTimePicker` / `y-datetime-picker`            | Date and time picker                                              |
| DateTimeRangePicker | `YDateTimeRangePicker` / `y-datetime-range-picker` | Date-time range picker                                            |
| Dialog              | `YDialog`                                          | Dialog with drag and Escape support                               |
| Divider             | `YDivider`                                         | Horizontal/vertical divider with dashed and text modes            |
| Drawer              | `YDrawer`                                          | Drawer with four placements and resizable size                    |
| Dropmenu            | `YDropmenu`                                        | Dropdown menu based on menu item extraction                       |
| Empty               | `YEmpty`                                           | Empty state with custom icon and text                             |
| Form                | `YForm`                                            | Form layout, validation, and reset                                |
| FormItem            | `YFormItem`                                        | Form item with label, required marker, and errors                 |
| Icon                | `YIcon`                                            | Render Vue components as icons                                    |
| Input               | `YInput`                                           | Input with prefix/suffix and clearable support                    |
| InputGroup          | `YInputGroup`                                      | Horizontal input grouping with addons and unified size            |
| InputNumber         | `YInputNumber`                                     | Numeric input with step controls and keyboard support             |
| InputPassword       | `YInputPassword`                                   | Password input with visibility toggle                             |
| LinkButton          | `YLinkButton`                                      | Text-style button                                                 |
| Loading             | `YLoading`                                         | Loading indicators and container loading mode                     |
| Menu                | `YMenu`                                            | Menu with expanded and collapsed modes                            |
| MenuOption          | `YMenuOption`                                      | Declarative menu item                                             |
| Pagination          | `YPagination`                                      | Pagination with ellipsis, size changer, and quick jumper          |
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

---

## Size

Components with size variants use `small`, `default`, and `large` consistently.

```html
<template>
  <y-button size="small">Small</y-button>
  <y-button size="default">Default</y-button>
  <y-button size="large">Large</y-button>

  <y-input v-model:value="text" size="large" />
  <y-select v-model:value="city" :options="cityOptions" size="small" />
</template>
```

Supported components include `Button`, `Card`, `ColorPicker`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `DateTimeRangePicker`, `Empty`, `Input`, `InputGroup`, `InputNumber`, `Loading`, `Pagination`, `RadioButton`, `RadioButtonGroup`, `Segmented`, `Select`, `Switch`, `Table`, `Tag`, `TimePicker`, `TimeRangePicker`, and `Timeline`.

`Button` uses `default` for the middle size. The old `middle` value is not supported.

`Icon.size` accepts a number or string value, not the three-level enum.

---

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

---

## Development

```bash
git clone https://github.com/EakerZT/yiz-ui.git
cd yiz-ui

yarn

yarn dev
yarn site:build
yarn typecheck
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

---

## Publishing

```bash
npm version patch # or minor / major

# prepublishOnly runs typecheck + build automatically
npm publish
```

---

## Acknowledgements

- [Sortable](https://github.com/SortableJS/Sortable) — `SortableBox` references its drag sorting behavior, event model, and edge handling.
- [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next) — `SortableBox` references its Vue component wrapper and data synchronization approach.
- [OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars) — `ScrollBox` references its custom scrollbar interaction and overlay scrolling experience.
- [BProgress](https://github.com/imskyleen/bprogress) — `LoadingBar` ports its core engine and references its progress state machine, trickle strategy, and positioning CSS.

---

## License

[MIT](LICENSE)
