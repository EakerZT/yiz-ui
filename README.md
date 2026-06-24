<p align="center">
  <h1 align="center">Yiz UI</h1>
</p>

<p align="center">
  A Vue 3 component library — built with TypeScript, clean and lightweight.
</p>

<p align="center">
  一个基于 Vue 3 的 UI 组件库 — TypeScript 编写，简洁轻量。
</p>

<p align="center">
  <a href="https://github.com/EakerZT/yiz-ui"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://www.npmjs.com/package/@eakerzt/yiz-ui"><img src="https://img.shields.io/npm/v/@eakerzt/yiz-ui" alt="npm"></a>
</p>

---

## 特性 / Features

- 🌗 **40+ 组件** — 涵盖表单、数据展示、导航、反馈等常用场景
- 🔧 **TypeScript** — 完整类型支持，严格模式开发
- 🎨 **CSS 变量主题** — 通过 `--yiz-*` 自定义属性轻松定制
- 🌍 **内置 i18n** — 内置中英文，支持动态切换和扩展语言
- 🪶 **Tree Shaking** — 按需引入，不会打包未使用的组件
- 📦 **Vue 3.4+** — 使用 `defineModel`、`<script setup>` 等最新特性
- 🎯 **无外部图标依赖** — 弹窗关闭按钮使用内联 SVG

> 🌗 **40+ components** covering forms, data display, navigation, feedback, and more
> 🔧 **TypeScript-first** — full type safety, developed in strict mode
> 🎨 **CSS variable theming** — customize via `--yiz-*` custom properties
> 🌍 **Built-in i18n** — Chinese & English out of the box, extensible via API
> 🪶 **Tree shakable** — import only what you use
> 📦 **Vue 3.4+** — leverages `defineModel`, `<script setup>`, and more
> 🎯 **Zero icon dependencies** — overlay close buttons use inline SVG

---

## 安装 / Installation

```bash
npm install @eakerzt/yiz-ui
# or
yarn add @eakerzt/yiz-ui
# or
pnpm add @eakerzt/yiz-ui
```

**Peer dependency:**

| 依赖 | 版本 |
|------|------|
| vue  | ≥ 3.2.0 |

---

## 快速开始 / Quick Start

### 全局注册 / Full registration

```ts
import { createApp } from 'vue'
import yiz from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
import App from './App.vue'

const app = createApp(App)
app.use(yiz)
app.mount('#app')
```

全局注册后，所有组件以 `Y` 前缀使用：

> After global registration, all components are available with a `Y` prefix:

```html
<template>
  <y-button type="primary" @click="handleClick">点击</y-button>
  <y-input v-model:value="text" placeholder="请输入" />
  <y-table :data="list">
    <y-table-column label="姓名" field="name" />
    <y-table-column label="年龄" field="age" />
  </y-table>
</template>
```

### 按需引入 / On-demand import

```ts
import { Button, Input, Table, TableColumn } from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
```

```html
<template>
  <Button type="primary">按钮</Button>
  <Input v-model:value="text" />
  <Table :data="list">
    <TableColumn label="姓名" field="name" />
    <TableColumn label="年龄" field="age" />
  </Table>
</template>
```

### Notification（命令式调用） / Notification (imperative API)

```ts
import { notification } from '@eakerzt/yiz-ui'

// 基础用法
notification({ title: '成功', content: '操作完成', type: 'success' })

// 快捷方法
notification.info({ content: '提示信息' })
notification.success({ content: '操作成功' })
notification.warning({ content: '警告信息' })
notification.error({ content: '错误信息' })

// 手动关闭
const handle = notification({ content: '加载中...', duration: 0 })
handle.close()
```

### ContextMenu（命令式调用） / ContextMenu (imperative API)

```ts
import { showContextMenu } from '@eakerzt/yiz-ui'

// 在右键事件位置弹出
showContextMenu(
  {
    items: [
      { type: 'item', label: '刷新', key: 'refresh' },
      { type: 'divider' },
      { type: 'item', label: '删除', key: 'delete', disabled: true }
    ],
    onSelect: (item) => console.log(item.key)
  },
  event
)
```

支持 `item` / `divider` / `submenu` / `checkbox` / `radiogroup` 五种项类型，嵌套子菜单会自动进行边缘翻转。

> Supports five item types: `item` / `divider` / `submenu` / `checkbox` / `radiogroup`; nested submenus auto-flip at viewport edges.

---

## 组件 / Components

| 组件 Component | 标签 Tag | 说明 Description |
| :--- | :--- | :--- |
| Button | `YButton` | 按钮 — 支持类型、颜色、形状、涟漪动画 |
| ButtonGroup | `YButtonGroup` | 按钮组 — 水平/垂直排列 |
| Card | `YCard` | 卡片 — 结构化内容容器 |
| Checkbox | `YCheckbox` | 复选框 — 支持单用和组合 |
| CheckboxGroup | `YCheckboxGroup` | 复选框组 — provide/inject 模式 |
| ColorPicker | `YColorPicker` | 颜色选择器 — HSV 面板 + 预设色 |
| DatePicker | `YDatePicker` | 日期选择器 — 月份/年份快速跳转 |
| DateRangePicker | `YDateRangePicker` | 日期范围选择器 — 自动排序起止日期 |
| Dialog | `YDialog` | 对话框 — 支持拖拽、ESC 关闭 |
| Divider | `YDivider` | 分割线 — 水平/垂直、虚线、带文本 |
| Drawer | `YDrawer` | 抽屉 — 四方向、可调节尺寸 |
| Dropmenu | `YDropmenu` | 下拉菜单 — 基于 Menu 的弹出菜单 |
| Empty | `YEmpty` | 空状态 — 可自定义图标和文案 |
| Form | `YForm` | 表单 — layout 布局（水平/垂直/行内）、字段校验、重置 |
| FormItem | `YFormItem` | 表单项 — 标签、必填标记、错误提示 |
| Icon | `YIcon` | 图标 — 渲染 Vue 组件为图标 |
| Input | `YInput` | 输入框 — 前后缀、可清空 |
| InputNumber | `YInputNumber` | 数字输入 — 步进按钮、键盘操作 |
| InputPassword | `YInputPassword` | 密码输入 — 显示/隐藏切换 |
| LinkButton | `YLinkButton` | 链接按钮 — 文字按钮样式 |
| Loading | `YLoading` | 加载 — 三种动画、容器模式、fullHeight 撑满 |
| Menu | `YMenu` | 菜单 — 支持展开/折叠模式 |
| MenuOption | `YMenuOption` | 菜单选项 — 声明式子项 |
| Pagination | `YPagination` | 分页 — 页码省略逻辑、快速跳转 |
| Radio | `YRadio` | 单选框 — 支持单用和组合 |
| RadioGroup | `YRadioGroup` | 单选组 — options / slot 双 API |
| RadioButton | `YRadioButton` | 单选按钮 — 按钮风格单选 |
| RadioButtonGroup | `YRadioButtonGroup` | 单选按钮组 — 按钮风格的互斥选择 |
| ScrollBox | `YScrollBox` | 滚动容器 — 自定义滚动条，GPU 定位 |
| Segmented | `YSegmented` | 分段器 — 滑块指示器、选项禁用 |
| Select | `YSelect` | 选择器 — 支持搜索、键盘导航 |
| SelectOption | `YSelectOption` | 选择器选项 — 声明式子项 |
| Slider | `YSlider` | 滑动条 — 单/双滑块、步长、刻度标记 |
| Switch | `YSwitch` | 开关 — 支持加载态、自定义颜色 |
| Tab | `YTab` | 标签页 — 四方向、卡片风格、切换动画、flex 弹性布局 |
| TabPane | `YTabPane` | 标签页面板 — label 插槽、closable 关闭 |
| Table | `YTable` | 表格 — 排序、列宽拖拽、行选择、固定列 |
| TableColumn | `YTableColumn` | 表格列 — 声明式列定义 + 自定义渲染 |
| Tag | `YTag` | 标签 — 预设色/自定义色、可关闭 |
| Textarea | `YTextarea` | 文本域 — 自适应行高、字数统计、可清空 |
| TimePicker | `YTimePicker` | 时间选择器 — 时分秒列选择 |
| TimeRangePicker | `YTimeRangePicker` | 时间范围选择器 — 自动排序起止时间 |
| Timeline | `YTimeline` | 时间线 — 左/右/交替模式、自定义节点 |
| TimelineItem | `YTimelineItem` | 时间线项 — 标题、时间、类型、空心节点 |
| Tooltip | `YTooltip` | 文字提示 — 四方向、CSS 箭头 |
| Tree | `YTree` | 树 — 递归渲染、复选/单选、半选态 |

---

## 国际化 / Internationalization

内置 `zh-CN`（默认）和 `en-US`。通过 `setLang()` 切换，组件会自动响应。

> Built-in `zh-CN` (default) and `en-US`. Switch via `setLang()` — components react automatically.

```ts
import { setLang, registerLang, registerLangItem, $t } from '@eakerzt/yiz-ui'

// 切换到英文 / Switch to English
setLang('en-US')

// 注册新语言 / Register a new language
registerLang('ja-JP', {
  'common.noData': 'データなし',
  'select.placeholder': '選択してください',
})

// 扩展已有语言 / Extend an existing language
registerLangItem('zh-CN', {
  'myComponent.title': '我的组件',
})

// 在组件中使用 / Use in your own components
const placeholder = computed(() => $t('select.placeholder'))
```

---

## 开发 / Development

```bash
# 克隆仓库 / Clone
git clone https://github.com/EakerZT/yiz-ui.git
cd yiz-ui

# 安装依赖 / Install dependencies
yarn

# 启动 Demo 开发服务器 / Start demo dev server
yarn demo

# 类型检查 / Type check
yarn typecheck

# 构建产物 / Build for production
yarn build
```

### 添加新组件 / Adding a new component

1. 创建 `scripts/<name>/<Name>.vue` 和 `scripts/<name>/index.ts`
2. 在 `scripts/components.ts` 中添加 `export * from './<name>'`（按字母顺序）
3. 创建 `site/pages/<Name>Demo.vue`
4. 在 `site/App.vue` 中注册 Demo 页面

> 1. Create `scripts/<name>/<Name>.vue` and `scripts/<name>/index.ts`
> 2. Add `export * from './<name>'` to `scripts/components.ts` (alphabetical order)
> 3. Create `site/pages/<Name>Demo.vue`
> 4. Register the demo page in `site/App.vue`

其余一切（Vue 插件注册、路径别名、全局组件名）均为自动。

> Everything else (plugin registration, path alias, global component name) is automatic.

---

## 发布 / Publishing

```bash
# 版本号升级 / Bump version
npm version patch  # or minor / major

# 发布（prepublishOnly 自动执行 typecheck + build）
npm publish
```

---

## License

[MIT](LICENSE)
