<p align="center">
  <h1 align="center">Yiz UI</h1>
</p>

<p align="center">
  一个基于 Vue 3 的 UI 组件库，使用 TypeScript 编写，简洁、轻量、实用。
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

- **45+ 组件**，覆盖表单、数据展示、导航、反馈和常见应用场景。
- **TypeScript 优先**，严格模式开发，组件 API 对类型友好。
- **CSS 变量主题**，通过 `--yiz-*` 自定义属性定制样式。
- **内置 i18n**，提供中文和英文，并支持运行时扩展语言。
- **支持 Tree Shaking**，按需引入，不打包未使用组件。
- **Vue 3.4+**，使用 `defineModel`、`<script setup>` 和现代 Vue 模式。
- **命令式 API**，支持通知、右键菜单和加载进度条。

---

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
| vue  | >= 3.2.0 |

---

## 快速开始

### 全局 CSS 前置设置

使用组件前，请在应用的全局样式中加入以下规则。部分组件的尺寸计算依赖 `border-box`；缺少该规则时，边框和内边距可能导致布局或尺寸异常。

```css
* {
  box-sizing: border-box;
}
```

### 全量注册

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

### 按需引入

```ts
import { Button, Input, Table, TableColumn } from '@eakerzt/yiz-ui'
import '@eakerzt/yiz-ui/dist/yiz-ui.css'
```

```html
<template>
  <button type="primary">按钮</button>
  <input v-model:value="text" />
  <table :data="list">
    <TableColumn label="姓名" field="name" />
    <TableColumn label="年龄" field="age" />
  </table>
</template>
```

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

### ContextMenu

```ts
import { showContextMenu } from '@eakerzt/yiz-ui'

showContextMenu(
  {
    items: [
      { type: 'item', label: '刷新', key: 'refresh' },
      { type: 'divider' },
      { type: 'item', label: '删除', key: 'delete', disabled: true },
    ],
    onSelect: (item) => console.log(item.key),
  },
  event,
)
```

`ContextMenu` 支持 `item`、`divider`、`submenu`、`checkbox`、`radiogroup` 五种项类型，嵌套子菜单会在视口边缘自动翻转。

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

---

## 组件

| 组件                | 标签                                               | 说明                                             |
| :------------------ | :------------------------------------------------- | :----------------------------------------------- |
| Button              | `YButton`                                          | 按钮，支持类型、颜色、形状、加载态和涟漪动画     |
| ButtonGroup         | `YButtonGroup`                                     | 水平或垂直按钮组                                 |
| Card                | `YCard`                                            | 结构化内容容器                                   |
| Checkbox            | `YCheckbox`                                        | 单个复选框                                       |
| CheckboxGroup       | `YCheckboxGroup`                                   | 基于 provide/inject 的复选框组                   |
| ColorPicker         | `YColorPicker`                                     | HSV 颜色选择器和预设色                           |
| DatePicker          | `YDatePicker`                                      | 日期选择器，支持月份/年份导航                    |
| DateRangePicker     | `YDateRangePicker`                                 | 日期范围选择器，支持自动排序                     |
| DateTimePicker      | `YDateTimePicker` / `y-datetime-picker`            | 日期时间选择器                                   |
| DateTimeRangePicker | `YDateTimeRangePicker` / `y-datetime-range-picker` | 日期时间范围选择器                               |
| Dialog              | `YDialog`                                          | 对话框，支持拖拽和 Escape 关闭                   |
| Divider             | `YDivider`                                         | 水平/垂直分割线，支持虚线和文本                  |
| Drawer              | `YDrawer`                                          | 四方向抽屉，可调节尺寸                           |
| Dropmenu            | `YDropmenu`                                        | 下拉菜单                                         |
| Empty               | `YEmpty`                                           | 空状态，可自定义图标和文案                       |
| Form                | `YForm`                                            | 表单布局、校验和重置                             |
| FormItem            | `YFormItem`                                        | 表单项，支持标签、必填标记和错误提示             |
| Icon                | `YIcon`                                            | 将 Vue 组件渲染为图标                            |
| Input               | `YInput`                                           | 输入框，支持前后缀和可清空                       |
| InputGroup          | `YInputGroup`                                      | 横向输入组合，支持 addon 和统一尺寸              |
| InputNumber         | `YInputNumber`                                     | 数字输入，支持步进按钮和键盘操作                 |
| InputPassword       | `YInputPassword`                                   | 密码输入，支持显示/隐藏                          |
| LinkButton          | `YLinkButton`                                      | 文本按钮                                         |
| Loading             | `YLoading`                                         | 加载动画和容器加载模式                           |
| Menu                | `YMenu`                                            | 菜单，支持展开和折叠模式                         |
| MenuOption          | `YMenuOption`                                      | 声明式菜单项                                     |
| Pagination          | `YPagination`                                      | 分页，支持省略、页大小选择和快速跳转             |
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

---

## 尺寸

支持尺寸的组件统一使用 `small`、`default`、`large` 三档。

```html
<template>
  <y-button size="small">Small</y-button>
  <y-button size="default">Default</y-button>
  <y-button size="large">Large</y-button>

  <y-input v-model:value="text" size="large" />
  <y-select v-model:value="city" :options="cityOptions" size="small" />
</template>
```

适用组件包括 `Button`、`Card`、`ColorPicker`、`DatePicker`、`DateRangePicker`、`DateTimePicker`、`DateTimeRangePicker`、`Empty`、`Input`、`InputGroup`、`InputNumber`、`Loading`、`Pagination`、`RadioButton`、`RadioButtonGroup`、`Segmented`、`Select`、`Switch`、`Table`、`Tag`、`TimePicker`、`TimeRangePicker`、`Timeline`。

`Button` 使用 `default` 表示中等尺寸，不支持旧的 `middle`。

`Icon.size` 接收数字或字符串尺寸，不使用三档枚举。

---

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

---

## 开发

```bash
git clone https://github.com/EakerZT/yiz-ui.git
cd yiz-ui

yarn

yarn dev
yarn site:build
yarn typecheck
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

---

## 发布

```bash
npm version patch # 或 minor / major

# prepublishOnly 会自动执行 typecheck + build
npm publish
```

---

## 致谢

- [Sortable](https://github.com/SortableJS/Sortable) — `SortableBox` 参考了其拖拽排序行为、事件模型和边界处理。
- [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next) — `SortableBox` 参考了其 Vue 组件封装和数据同步思路。
- [OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars) — `ScrollBox` 参考了其自定义滚动条交互和覆盖式滚动体验。
- [BProgress](https://github.com/imskyleen/bprogress) — `LoadingBar` 移植了其 core 引擎，并参考了进度状态机、trickle 策略和定位 CSS。

---

## License

[MIT](LICENSE)
