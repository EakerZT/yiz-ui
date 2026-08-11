<p align="center">
  <h1 align="center">Yiz UI</h1>
</p>

<p align="center">
  一个基于 Vue 3 和 TypeScript 的 UI 组件库，简洁、轻量、实用。
</p>

<p align="center">
  <a href="./README.md">English</a> | 简体中文
</p>

<p align="center">
  <a href="https://github.com/EakerZT/yiz-ui"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://www.npmjs.com/package/@eakerzt/yiz-ui"><img src="https://img.shields.io/npm/v/@eakerzt/yiz-ui" alt="npm"></a>
</p>

---

## 特性

- **50+ 组件**，覆盖表单、数据展示、导航、反馈和常见应用场景。
- **TypeScript 优先**，严格模式开发，组件 API 对类型友好。
- **Vue 3.4+**，使用 `defineModel`、`<script setup>` 和现代 Vue 模式。
- **CSS 变量主题**，通过 `--yiz-*` 自定义属性定制样式。
- **内置 i18n**，提供中文和英文，并支持运行时扩展语言。
- **支持 Tree Shaking**，组件导出支持按需引入。
- **工具 API**，支持全局提示、确认框、模态层级管理、通知、右键菜单、加载进度条和类型化事件总线。

## 安装

```bash
npm install @eakerzt/yiz-ui
# 或
yarn add @eakerzt/yiz-ui
# 或
pnpm add @eakerzt/yiz-ui
```

**Peer dependency：**

| 依赖 | 版本     |
| :--- | :------- |
| vue  | >= 3.4.0 |

## 文档

- [在线示例](https://eakerzt.github.io/yiz-ui/)
- [更新记录](update.md)

## 快速开始

引入全局样式并安装插件：

```ts
import { createApp } from 'vue'
import yiz from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
import App from './App.vue'

const app = createApp(App)
app.use(yiz)
app.mount('#app')
```

全量注册后，所有组件都可以使用 `Y` 前缀：

```vue
<template>
  <y-button type="primary" @click="handleClick">点击</y-button>
  <y-input v-model:value="text" placeholder="请输入" />
  <y-table :data="list">
    <y-table-column label="姓名" field="name" />
    <y-table-column label="年龄" field="age" />
  </y-table>
</template>
```

### 全局 CSS 前置设置

部分组件的尺寸计算依赖 `border-box`。使用组件前，请在应用的全局样式中加入以下规则：

```css
* {
  box-sizing: border-box;
}
```

### 设计 Token

YIZ UI 在 `:root` 上提供分层的 CSS 自定义属性。引入组件库样式后覆盖语义 Token，即可创建桌面端主题，无需修改组件内部样式：

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

对外开放的 Token 分组包括：

- 颜色：`--yiz-color-{primary|success|warning|error}-*`、`--yiz-color-text-*`、`--yiz-color-bg-*`、`--yiz-color-border-*` 和 `--yiz-color-mask`。
- 尺寸与间距：`--yiz-control-height-*`、`--yiz-control-padding-x-*`、`--yiz-icon-size-*` 和 `--yiz-space-*`。
- 圆角与排版：`--yiz-radius-*`、`--yiz-font-size-*`、`--yiz-font-weight-*` 和 `--yiz-line-height-*`。
- 阴影与交互：`--yiz-shadow-*`、`--yiz-motion-*`、`--yiz-control-*-shadow` 和 `--yiz-focus-ring-color`。

原有拼写错误的 `--yiz-color-*-heary*` 变量继续作为兼容别名保留；新主题请使用 `--yiz-color-*-dark*`。

### 按需引入

```ts
import { Button, Input, Table, TableColumn } from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
```

```vue
<template>
  <Button type="primary">按钮</Button>
  <Input v-model:value="text" />
  <Table :data="list">
    <TableColumn label="姓名" field="name" />
    <TableColumn label="年龄" field="age" />
  </Table>
</template>
```

## 工具 API

### Message

```ts
import { message } from '@eakerzt/yiz-ui'

message('操作完成')
message.success('保存成功')
message.warning('请检查表单')
message.error('操作失败')

message.loading({ key: 'save', content: '保存中...' })
message.success({ key: 'save', content: '已保存', duration: 2000 })

message.destroy()
```

### Dialog.confirm

```ts
import { Dialog } from '@eakerzt/yiz-ui'

Dialog.confirm({
  title: '确认执行操作？',
  content: '该操作会立即生效，请确认是否继续。',
  onOk: async () => {
    await submit()
  },
})
```

`onOk` 可以返回 Promise，此时确认按钮会进入 loading；返回 `false` 时确认框不会关闭。

如果项目启用了模态层级管理，推荐使用 `useDialog()`，这样确认框可以继承当前层级：

```ts
import { useDialog } from '@eakerzt/yiz-ui'

const dialog = useDialog()

dialog.confirm({
  title: '确认执行操作？',
  content: '这个确认框属于当前 modal layer。',
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
  // 根层快捷键
})
```

`Dialog`、`Drawer` 和 `useDialog().confirm()` 会在存在上层 modal layer 时加入层级栈。没有提供上层 layer 时，它们保持原有行为并忽略层级管理。

### Notification

```ts
import { notification } from '@eakerzt/yiz-ui'

notification({ title: '成功', content: '操作完成', type: 'success' })

notification.info({ content: '提示信息' })
notification.success({ content: '操作成功' })
notification.warning({ content: '警告信息' })
notification.error({ content: '错误信息' })

const handle = notification({ content: '加载中...', duration: 0 })
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

默认色使用 `--yiz-color-primary`，`fail()` 使用 `--yiz-color-error`。不确定模式（`indeterminate: true`）会显示来回滑动的动画条，不显示百分比。

### ContextMenu

```ts
import { showContextMenu } from '@eakerzt/yiz-ui'

showContextMenu({
  x: event.clientX,
  y: event.clientY,
  width: 200,
  menus: [
    { type: 'item', label: '刷新', value: 'refresh' },
    { type: 'divider' },
    { type: 'item', label: '删除', value: 'delete', disabled: true },
  ],
  onSelect: (item) => console.log(item.value),
  onClose: () => console.log('已关闭'),
})
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
emitter.emit('notify', '已保存')
off()

export const formEmitter = createEmitter<FormEvents>('form')
formEmitter.emit('submit', new FormData(), true)

const { emit, emitAsync, on, once, off: offEvent, clear, count } = useEmitter<FormEvents>('form')

on('change', (value) => {
  console.log(value)
})

once('reset', () => {
  console.log('只触发一次 reset')
})

emit('change', 'draft')
await emitAsync('submit', new FormData(), true)

offEvent('change')
clear('change')
console.log(count('change'))
```

`createEmitter()` 不传 name 时会创建一个独立 emitter。`createEmitter(name)` 会注册具名共享 emitter，同名重复创建会报错。`useEmitter(name)` 只使用已经存在的具名 emitter，并且必须在 Vue setup 或 effect scope 中调用。

## 组件

| 组件                | 标签                                               | 说明                                             |
| :------------------ | :------------------------------------------------- | :----------------------------------------------- |
| Breadcrumb          | `YBreadcrumb`                                      | 面包屑导航，支持数据项和声明式子项               |
| BreadcrumbItem      | `YBreadcrumbItem`                                  | 声明式面包屑项                                   |
| Button              | `YButton`                                          | 按钮，支持类型、颜色、形状、加载态和涟漪动画     |
| ButtonGroup         | `YButtonGroup`                                     | 水平或垂直按钮组                                 |
| Card                | `YCard`                                            | 结构化内容容器                                   |
| Checkbox            | `YCheckbox`                                        | 单个复选框                                       |
| CheckboxGroup       | `YCheckboxGroup`                                   | 基于 provide/inject 的复选框组                   |
| Collapse            | `YCollapse`                                        | 折叠面板，支持手风琴和高度过渡动画               |
| CollapseItem        | `YCollapseItem`                                    | 折叠面板项，支持标题和右侧额外内容插槽           |
| ColorPicker         | `YColorPicker`                                     | HSV 颜色选择器和预设色                           |
| DatePicker          | `YDatePicker`                                      | 日期选择器，支持月份/年份导航                    |
| DateRangePicker     | `YDateRangePicker`                                 | 日期范围选择器，支持自动排序                     |
| DateTimePicker      | `YDateTimePicker` / `y-datetime-picker`            | 日期时间选择器                                   |
| DateTimeRangePicker | `YDateTimeRangePicker` / `y-datetime-range-picker` | 日期时间范围选择器                               |
| Descriptions        | `YDescriptions`                                    | 描述列表，支持边框、垂直布局和列数配置           |
| DescriptionItem     | `YDescriptionItem`                                 | 声明式描述列表项                                 |
| Dialog              | `YDialog`                                          | 对话框，支持拖拽、Escape 关闭、确认框 API 和层级管理 |
| Divider             | `YDivider`                                         | 水平/垂直分割线，支持虚线和文本                  |
| Drawer              | `YDrawer`                                          | 四方向抽屉，可调节尺寸                           |
| Dropmenu            | `YDropmenu`                                        | 下拉菜单                                         |
| DropmenuItem        | `YDropmenuItem`                                    | 声明式下拉菜单项                                 |
| Empty               | `YEmpty`                                           | 空状态，可自定义图标和文案                       |
| Form                | `YForm`                                            | 表单布局、校验和重置                             |
| FormItem            | `YFormItem`                                        | 表单项，支持标签、必填标记和错误提示             |
| Icon                | `YIcon`                                            | 将 Vue 组件渲染为图标                            |
| Info                | `YInfo`                                            | 行内状态文本，支持预设提示类型                   |
| Input               | `YInput`                                           | 输入框，支持前后缀和可清空                       |
| InputCustom         | `YInputCustom`                                     | 输入框风格外壳，用于自定义或第三方逻辑           |
| InputGroup          | `YInputGroup`                                      | 横向输入组合，支持 addon 和统一尺寸              |
| InputNumber         | `YInputNumber`                                     | 数字输入，支持步进按钮和键盘操作                 |
| InputPassword       | `YInputPassword`                                   | 密码输入，支持显示/隐藏                          |
| LinkButton          | `YLinkButton`                                      | 文本按钮                                         |
| Loading             | `YLoading`                                         | 加载动画和容器加载模式                           |
| Menu                | `YMenu`                                            | 菜单，支持展开和折叠模式                         |
| MenuOption          | `YMenuOption`                                      | 声明式菜单项                                     |
| Pagination          | `YPagination`                                      | 分页，支持省略、页大小选择和快速跳转             |
| Popover             | `YPopover`                                         | 气泡卡片，支持点击、悬停、聚焦和受控模式         |
| Progress            | `YProgress`                                        | 线性进度条，支持状态、自定义颜色和文字格式化     |
| Radio               | `YRadio`                                           | 单个单选框                                       |
| RadioGroup          | `YRadioGroup`                                      | 单选组，支持 options 和 slot                     |
| RadioButton         | `YRadioButton`                                     | 按钮风格单选                                     |
| RadioButtonGroup    | `YRadioButtonGroup`                                | 按钮风格互斥选择组                               |
| ScrollBox           | `YScrollBox`                                       | 自定义滚动条容器，使用 GPU 定位                  |
| Segmented           | `YSegmented`                                       | 分段器，支持动画指示器                           |
| Select              | `YSelect`                                          | 选择器，支持搜索和键盘导航                       |
| SelectOption        | `YSelectOption`                                    | 声明式选择器选项                                 |
| Slider              | `YSlider`                                          | 单/双滑块，支持步长和刻度标记                    |
| SortableBox         | `YSortableBox`                                     | Vue 数据优先的拖拽排序容器，支持跨列表预览       |
| Switch              | `YSwitch`                                          | 开关，支持加载态和自定义颜色                     |
| Tab                 | `YTab`                                             | 标签页，支持四方向、卡片风格、动画和 flex 布局   |
| TabPane             | `YTabPane`                                         | 标签页面板，支持 label 插槽和关闭                |
| Table               | `YTable`                                           | 表格，支持排序、列宽拖拽、行选择、加载态和固定列 |
| TableColumn         | `YTableColumn`                                     | 声明式表格列，支持自定义渲染                     |
| Tag                 | `YTag`                                             | 标签，支持预设色/自定义色和关闭                  |
| Textarea            | `YTextarea`                                        | 文本域，支持自适应高度、字数统计和可清空         |
| TimePicker          | `YTimePicker`                                      | 时间选择器，支持时分秒列                         |
| TimeRangePicker     | `YTimeRangePicker`                                 | 时间范围选择器，支持自动排序                     |
| Timeline            | `YTimeline`                                        | 时间线，支持左/右/交替模式                       |
| TimelineItem        | `YTimelineItem`                                    | 时间线项，支持标题、时间、类型和空心节点         |
| Tooltip             | `YTooltip`                                         | 文字提示，支持四方向和 CSS 箭头                  |
| Tree                | `YTree`                                            | 递归树，支持复选/单选和半选态                    |
| Upload              | `YUpload`                                          | 插槽驱动的文件选择，支持点击、拖动、多选和类型   |

## 尺寸

支持尺寸的组件统一使用 `small`、`default`、`large` 三档。

```vue
<template>
  <y-button size="small">Small</y-button>
  <y-button size="default">Default</y-button>
  <y-button size="large">Large</y-button>

  <y-input v-model:value="text" size="large" />
  <y-select v-model:value="city" :options="cityOptions" size="small" />
</template>
```

适用组件包括 `Button`、`Card`、`ColorPicker`、`DatePicker`、`DateRangePicker`、`DateTimePicker`、`DateTimeRangePicker`、`Descriptions`、`Empty`、`Input`、`InputCustom`、`InputGroup`、`InputNumber`、`Loading`、`Pagination`、`RadioButton`、`RadioButtonGroup`、`Segmented`、`Select`、`Switch`、`Table`、`Tag`、`TimePicker`、`TimeRangePicker`、`Timeline`。

`Button` 使用 `default` 表示中等尺寸，不支持旧的 `middle`。

`Icon.size` 接收数字或字符串尺寸，不使用三档枚举。

## 国际化

内置语言：

- `zh-CN`（默认）
- `en-US`

通过 `setLang()` 切换语言，组件会自动响应。

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

## 开发

本仓库使用 Yarn Classic。仓库开发命令不要使用 `npm` 或 `pnpm`。

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

### 添加新组件

1. 创建 `scripts/<name>/<Name>.vue` 和 `scripts/<name>/index.ts`。
2. 在 `scripts/components.ts` 中按字母顺序添加 `export * from './<name>'`。
3. 创建 `site/pages/<Name>Demo.vue`。
4. 在 `site/App.vue` 中注册 Demo 页面。

其余内容，包括插件注册、路径别名和全局组件名，均为自动处理。

### 计划文档

- [SortableBox 后续计划](plans/sortable-box-roadmap.md)

## 发布

推送 `v*` 标签后，GitHub Actions 会自动发布包。

```bash
npm version patch # 或 minor / major
git push --follow-tags
```

发布工作流会执行 `yarn install --frozen-lockfile`、`yarn typecheck`、`yarn build` 和 `npm publish --access public`。

本地兜底发布：

```bash
npm publish
```

`prepublishOnly` 会在发布前自动执行 `yarn typecheck && yarn build`。

## 致谢

- [Sortable](https://github.com/SortableJS/Sortable) - `SortableBox` 参考了其拖拽排序行为、事件模型和边界处理。
- [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next) - `SortableBox` 参考了其 Vue 组件封装和数据同步思路。
- [OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars) - `ScrollBox` 参考了其自定义滚动条交互和覆盖式滚动体验。
- [BProgress](https://github.com/imskyleen/bprogress) - `LoadingBar` 移植了其 core 引擎，并参考了进度状态机、trickle 策略和定位 CSS。
- [EventEmitter3](https://github.com/primus/eventemitter3) - `Emitter` 参考了其简洁的同步事件模型和热路径性能思路。
- [Emittery](https://github.com/sindresorhus/emittery) - `Emitter` 参考了其显式异步触发语义和类型化事件 API 方向。
- [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) - `Emitter` 参考了其小 API 面和直接的订阅模型。

## License

[MIT](LICENSE)
