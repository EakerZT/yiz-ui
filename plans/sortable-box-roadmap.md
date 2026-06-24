# SortableBox 后续计划与差距分析

本文用于跟踪 `SortableBox` 当前状态、与 Sortable 的差距，以及后续实现计划。

## 当前结论

`SortableBox` 已经达到基本可用状态。

当前实现更偏 Vue 数据优先模型，而不是 Sortable 的 DOM-first 模型。拖动过程通过 preview 数据驱动 Vue 渲染，drop 时提交真实数组。这比直接复刻 Sortable 更适合组件库和 Vue 业务场景。

## 已完成能力

- 单列表排序。
- 跨列表拖动。
- 固定源列表：`mode="source"`。
- `v-model` / `list` 两种数据源。
- `itemKey`。
- `item` / `header` / `footer` slots。
- 不额外生成 item 包裹 DOM。
- 组件本体不内置列表布局、gap、padding、边框等页面样式。
- `group` 字符串和对象形式。
- `group.pull` / `group.put`，支持 boolean、`'clone'`、字符串、数组、函数。
- `clone` / `createItem`。
- `sort` / `disabled`。
- `handle-class`。
- `filter` / `preventOnFilter`。
- `ghost-class` / `chosen-class` / `drag-class`。
- `direction="vertical"` / `direction="horizontal"`。
- `minItems` / `maxItems`。
- `lockedKeys`。
- `canDrag` / `canLeave` / `canEnter` / `canDrop` / `canSort`。
- `move` 兜底回调。
- 实时 preview：
  - `preview-start`
  - `preview-change`
  - `preview-cancel`
  - `preview-commit`
- Vue change 事件：
  - `added`
  - `removed`
  - `moved`
- 基础 Sortable 风格事件：
  - `choose`
  - `unchoose`
  - `start`
  - `end`
  - `add`
  - `remove`
  - `update`
  - `sort`
  - `filter`
- AutoScroll 基础能力：
  - `scroll`
  - `scrollSensitivity`
  - `scrollSpeed`
  - `bubbleScroll`
- 基础阈值能力：
  - `swap-threshold`
  - `invert-swap`
  - `inverted-swap-threshold`
  - `empty-insert-threshold`
- FLIP 位移动画：
  - `animation`
  - `easing`
- 暴露方法：
  - `toArray()`
  - `sort(order)`
  - `option(name)`
  - `option(name, value)`
- 嵌套列表 demo。
- 横向拖动 demo。
- `handle-class` demo。
- `drag-class` demo。
- 双面板同步 preview demo：
  - 一份真实数据。
  - 一份临时 preview 数据。
  - 画布面板和图层面板同步排序预览。
  - 拖动时另一个面板高亮对应元素。

## 与 Sortable 的主要差距

### 1. Swap 模式

Sortable 的 Swap 插件支持拖到目标项上时交换两个元素，而不是插入排序。

缺失能力：

- `swap`
- `swapClass`
- `swapItem` 事件字段
- swap 模式下的 preview 和 commit 逻辑

### 2. MultiDrag

Sortable 的 MultiDrag 插件支持多选拖拽。

缺失能力：

- `selectedClass`
- 多选状态管理
- 点击选择 / 取消选择
- Shift 区间选择
- 多项 ghost / 占位表现
- 多项批量移动
- 多项批量 clone
- 多项事件字段：
  - `items`
  - `oldIndicies`
  - `newIndicies`
  - `clones`

这是后续实现量最大的一块。

### 3. OnSpill

Sortable 的 OnSpill 插件处理拖出有效容器后释放。

缺失能力：

- `revertOnSpill`
- `removeOnSpill`
- `spill` 事件

### 4. 事件字段不完整

当前事件偏 Vue 数据模型，字段相对精简。

Sortable 事件里还包含：

- `to` DOM
- `from` DOM
- `clone`
- `oldDraggableIndex`
- `newDraggableIndex`
- `related`
- `draggedRect`
- `relatedRect`
- `willInsertAfter`
- `pullMode` 的更完整语义

当前 `move` 事件已有 `draggedContext` / `relatedContext`，但还没有补齐 DOM rect 和插入方向字段。

### 5. `clone` 事件

当前支持 `clone` / `createItem` 生成拖入数据，但没有独立的 `clone` emit。

### 6. 实例方法

当前已有：

- `option`
- `toArray`
- `sort`

Sortable 还提供：

- `closest`
- `save`
- `destroy`

Vue 组件里 `destroy` 一般不需要显式暴露，但 `closest` / `save` 可以根据实际使用场景评估。

### 7. store / dataIdAttr

Sortable 支持：

- `store.get`
- `store.set`
- `dataIdAttr`

Vue 场景里通常用外部状态管理替代，但如果要做 Sortable API 兼容，需要补。

### 8. 更复杂的方向检测

Sortable 的 `direction` 可以是函数，也能根据 flex / grid / float 等样式自动判断方向。

当前 `SortableBox` 只支持显式：

- `vertical`
- `horizontal`

### 9. HTML5 DnD / fallback / 移动端

当前有意不实现这些兼容能力：

- HTML5 DnD
- `dataTransfer`
- `setData`
- `forceFallback`
- `fallbackClass`
- `fallbackOnBody`
- `fallbackTolerance`
- `fallbackOffset`
- `delayOnTouchOnly`
- `touchStartThreshold`
- iOS / Android 兼容分支

这些不是当前项目优先级，因为目标是现代 Vue 3 桌面场景。

## SortableBox 已有但 Sortable 不直接提供的业务增强

- `mode`
  - `sortable`
  - `source`
  - `target`
  - `readonly`
- `minItems`
- `maxItems`
- `lockedKeys`
- `canDrag`
- `canLeave`
- `canEnter`
- `canDrop`
- `canSort`
- `createItem`
- 实时 `preview-change`
- 双面板同步预览可以直接用临时变量实现

这些能力更贴近组件库、页面搭建器、图层面板、画布编辑器等业务场景。

## 后续计划

### P0：稳定当前核心能力

目标：保证现有排序、跨列表、preview、动画和 demo 稳定。

任务：

- 补充更多手动验证场景：
  - 向前拖
  - 向后拖
  - 拖到列表首位
  - 拖到列表末尾
  - 空列表插入
  - 横向拖动
  - 嵌套列表
  - 双面板同步 preview
- 检查 `swap-threshold` / `invert-swap` 在边界位置的交互是否符合预期。
- 检查 FLIP 动画连续拖动时是否有 transition 残留。
- 检查 AutoScroll 在列表头尾是否还有抖动。

### P1：事件字段补齐

目标：让事件更接近 Sortable，方便高级业务判断。

任务：

- 给 `SortableMoveEvent` 增加：
  - `draggedRect`
  - `relatedRect`
  - `willInsertAfter`
  - `related`
- 给基础事件增加可选 DOM 字段：
  - `itemElement`
  - `fromElement`
  - `toElement`
- 增加 `clone` 事件。
- 明确 `oldIndex/newIndex` 在 preview、commit、跨列表、clone 场景下的语义。

### P2：Swap 模式

目标：实现 Sortable Swap 插件等价能力。

建议 API：

```ts
swap?: boolean
swapClass?: string
```

事件补充：

```ts
swapItem?: T
swapIndex?: number
```

实现要点：

- 拖动命中目标元素时，不计算插入 index，而是记录 swap target。
- preview 阶段生成交换后的数组。
- commit 阶段提交交换结果。
- `swapClass` 只作用于当前可交换目标。
- 跨列表 swap 是否支持需要单独确认，建议第一版只支持同列表。

### P3：OnSpill

目标：处理拖出有效目标后释放。

建议 API：

```ts
revertOnSpill?: boolean
removeOnSpill?: boolean
```

事件：

```ts
spill
```

实现要点：

- 没有 active target 时 mouseup 进入 spill 分支。
- `revertOnSpill`：清空 preview，保持原数组。
- `removeOnSpill`：从源列表移除。
- `source` 模式和 `clone` 模式不应 remove 源数据。

### P4：MultiDrag

目标：实现多选拖拽。

建议 API：

```ts
multiple?: boolean
selectedKeys?: SortableKey[]
selectedClass?: string
multiDragKey?: 'ctrl' | 'shift' | 'alt' | 'meta'
avoidImplicitDeselect?: boolean
```

事件：

```ts
update:selectedKeys
select
deselect
```

实现要点：

- 内部以 key 集合管理选中状态。
- 拖动选中项中的任意一个时，整组选中项一起移动。
- preview 阶段批量 remove + batch insert。
- commit 阶段批量更新数组。
- 事件需要包含：
  - `items`
  - `oldIndices`
  - `newIndices`
- 第一版可以只支持同列表多拖，跨列表多拖后续再扩展。

### P5：实例方法与持久化

目标：补齐部分 Sortable 方法。

可选方法：

```ts
closest(element, selector?)
save()
```

可选 props：

```ts
store?: {
  get?: () => SortableKey[]
  set?: (keys: SortableKey[]) => void
}
```

说明：

- `destroy()` 在 Vue 中不建议暴露，组件卸载会自动清理。
- `save()` 可以直接调用 `store.set(toArray())`。

## 建议实现顺序

1. P0 稳定当前核心能力。
2. P1 补齐事件字段和 `clone` 事件。
3. P2 实现 Swap。
4. P3 实现 OnSpill。
5. P4 实现 MultiDrag。
6. P5 根据实际需求补实例方法和 store。

## 暂不建议做的事项

- 不建议为了兼容 Sortable API 引入 HTML5 DnD。
- 不建议加入旧浏览器 fallback。
- 不建议在组件内部添加默认布局样式。
- 不建议恢复 `handle` selector；当前保留 `handle-class` 更明确。
- 不建议让组件自动生成 item 包裹层。

