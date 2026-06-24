# SortableBox 设计笔记

本文记录 `Sortable` 与 `vue.draggable.next` 的源码梳理结果，用于后续设计并实现 `SortableBox`。

## 目标

- 新增 Vue 3 组件 `SortableBox`。
- 底层拖动排序能力不直接复用 `Sortable`，需要基于现有源码重新设计实现。
- 不考虑旧浏览器兼容，优先面向现代浏览器和 Vue 3 使用场景。
- 在开始写源码前，先确认核心能力、边界行为和 Vue 组件 API。

## 已阅读源码

Sortable:

- `Sortable/src/Sortable.js`
- `Sortable/src/utils.js`
- `Sortable/src/Animation.js`
- `Sortable/src/PluginManager.js`
- `Sortable/src/EventDispatcher.js`
- `Sortable/plugins/AutoScroll/AutoScroll.js`
- `Sortable/plugins/Swap/Swap.js`
- `Sortable/plugins/MultiDrag/MultiDrag.js`
- `Sortable/plugins/OnSpill/OnSpill.js`
- `Sortable/tests/Sortable.test.js`
- `Sortable/README.md`

vue.draggable.next:

- `vue.draggable.next/src/vuedraggable.js`
- `vue.draggable.next/src/core/componentBuilderHelper.js`
- `vue.draggable.next/src/core/componentStructure.js`
- `vue.draggable.next/src/core/renderHelper.js`
- `vue.draggable.next/src/core/sortableEvents.js`
- `vue.draggable.next/src/util/htmlHelper.js`
- `vue.draggable.next/README.md`
- `vue.draggable.next/tests/unit/vuedraggable.spec.js`

## Sortable 核心模型

Sortable 是 DOM-first 排序引擎。

拖动过程中它直接移动 DOM 节点，最后在 drop 阶段根据 DOM 的最终位置派发事件。数组数据不是它的关注点，Vue 适配层需要从 DOM 变化反推数据变化。

Sortable 使用大量模块级全局状态保存当前拖拽：

- `dragEl`
- `rootEl`
- `parentEl`
- `nextEl`
- `cloneEl`
- `ghostEl`
- `oldIndex`
- `newIndex`
- `putSortable`
- `activeGroup`
- `lastTarget`
- `lastDirection`

这种设计适合单一全局拖拽，但组件化时状态边界不够清晰。`SortableBox` 重写时应把拖拽状态收敛到实例和一个小型全局 registry 中。

## Sortable 生命周期

### 1. Pointer down / tap start

入口是 `_onTapStart`。

主要职责：

- 忽略不可取消事件。
- 忽略非左键。
- 检查 `disabled`。
- 忽略 `contenteditable`。
- 按 `draggable` 找到真正拖拽项。
- 检查 `filter`。
- 检查 `handle`。
- 记录 `oldIndex` 和 `oldDraggableIndex`。
- 进入 `_prepareDragStart`。

### 2. Prepare drag start

入口是 `_prepareDragStart`。

主要职责：

- 设置当前拖拽全局状态。
- 记录 pointer 起点。
- 记录拖拽元素相对指针的偏移。
- 保存 input checked 状态。
- 绑定 move/up/drop 事件。
- 处理 `delay`。
- 处理 `touchStartThreshold`。
- 派发 `choose`。

### 3. Drag start

入口是 `_onDragStart`。

主要职责：

- 创建 `cloneEl`。
- fallback 模式创建跟随指针的 `ghostEl`。
- 原生 DnD 模式设置 `dataTransfer`。
- 添加 `dragClass`。
- 启动 fallback dragover 模拟循环。
- 派发 `clone`。
- 进入 `_dragStarted`，派发 `start`。

### 4. Drag over

入口是 `_onDragOver`，这是 Sortable 的排序核心。

主要职责：

- 判断当前容器是否允许接收拖拽项。
- 判断同容器排序或跨容器移动。
- 根据 `direction` 计算垂直或水平排序。
- 根据鼠标位置、目标元素 rect 和阈值计算插入方向。
- 调用 `onMove`，允许用户取消或强制 before/after。
- 直接移动 DOM。
- 捕获和播放动画。
- 派发 `change`。

### 5. Drop

入口是 `_onDrop`。

主要职责：

- 停止定时器和事件监听。
- 删除 ghost 和 clone。
- 移除 class。
- 根据最终 DOM 位置计算 `newIndex`。
- 跨容器时派发 `add`、`remove`、`sort`。
- 同容器位置变化时派发 `update`、`sort`。
- 始终在有效拖拽结束后派发 `end`。
- 调用 `store.set`。
- 清空全局状态。

## Sortable 公开能力

### 主要 options

- `group`
- `sort`
- `disabled`
- `store`
- `handle-class`
- `draggable`
- `swapThreshold`
- `invertSwap`
- `invertedSwapThreshold`
- `removeCloneOnHide`
- `direction`
- `ghostClass`
- `chosenClass`
- `dragClass`
- `ignore`
- `filter`
- `preventOnFilter`
- `animation`
- `easing`
- `setData`
- `dropBubble`
- `dragoverBubble`
- `dataIdAttr`
- `delay`
- `delayOnTouchOnly`
- `touchStartThreshold`
- `forceFallback`
- `fallbackClass`
- `fallbackOnBody`
- `fallbackTolerance`
- `fallbackOffset`
- `emptyInsertThreshold`

现代实现中可以删除或弱化的旧兼容项：

- `forceFallback`
- `fallbackClass`
- `fallbackOnBody`
- `fallbackOffset`
- 原生 HTML5 DnD 专用 `setData`
- IE / Edge Legacy / Safari 特判

是否仍保留这些 prop 名称，需要后续确认。如果目标是兼容 Sortable API，可以保留但内部统一走 Pointer Events。

### 主要事件

- `choose`
- `unchoose`
- `start`
- `end`
- `add`
- `update`
- `sort`
- `remove`
- `filter`
- `move`
- `clone`
- `change`

事件核心字段：

- `to`
- `from`
- `item`
- `clone`
- `oldIndex`
- `newIndex`
- `oldDraggableIndex`
- `newDraggableIndex`
- `pullMode`
- `originalEvent`

`move` 事件额外字段：

- `dragged`
- `draggedRect`
- `related`
- `relatedRect`
- `willInsertAfter`

### 主要方法

- `option(name, value?)`
- `closest(el, selector?)`
- `toArray()`
- `sort(order, useAnimation?)`
- `save()`
- `destroy()`

## Sortable 边界机制

### group

`group` 支持字符串或对象。

对象字段：

- `name`
- `pull`
- `put`
- `revertClone`

`pull` 和 `put` 支持：

- `true`
- `false`
- `'clone'`
- group name 数组
- function

内部会统一转成 `checkPull` 和 `checkPut` 函数。

### 空列表插入

Sortable 通过 `emptyInsertThreshold` 支持插入空容器。

实现方式：

- 全局监听 move/dragover。
- 查找指针附近的空 Sortable 容器。
- 命中后伪造 dragover 事件。
- 进入该容器的 `_onDragOver`。

### 嵌套容器

嵌套排序依赖：

- DOM 父链查找带 Sortable 实例的容器。
- `dragoverBubble` 控制事件是否继续冒泡。
- `_isOutsideThisEl` 清理 `lastTarget`。

### 方向检测

默认 `direction` 是函数，会根据容器和子项样式判断：

- flex column -> vertical
- flex row -> horizontal
- grid 单列 -> vertical
- grid 多列 -> horizontal
- float / block / 宽度换行也参与判断

现代实现可以保留 `direction: 'vertical' | 'horizontal' | function`，但默认检测逻辑可以简化。

### swap 判定

核心函数是 `_getSwapDirection`。

输入：

- pointer 坐标
- target rect
- 当前方向
- `swapThreshold`
- `invertedSwapThreshold`
- `invertSwap`
- 是否连续命中同一 target

输出：

- `-1` 插到 target 前
- `1` 插到 target 后
- `0` 不移动

这块是重写时最需要单独设计和测试的逻辑。

### 动画

Sortable 使用 FLIP：

1. 操作 DOM 前记录 children rect。
2. 操作 DOM。
3. 计算新 rect。
4. 给元素设置 `translate3d(from - to)`。
5. 强制 repaint。
6. 过渡到 `translate3d(0,0,0)`。

重写时可以保留这个思路，但需要减少布局读写交错。

### AutoScroll

AutoScroll 插件负责拖拽靠近边缘时自动滚动。

实现要点：

- 找最近可滚动父级。
- 支持向上逐层 bubble 到 window scroller。
- 根据 pointer 到容器边缘的距离计算 `vx/vy`。
- 用 interval 持续滚动。
- fallback 模式中滚动时同步 ghost 位置。

### Swap

Swap 插件不是插入排序，而是在 drop 时交换两个 DOM 节点。

能力：

- `swap`
- `swapClass`
- 事件额外字段 `swapItem`

### MultiDrag

MultiDrag 是最复杂的插件。

能力：

- 多选 class：`selectedClass`
- 选择快捷键：`multiDragKey`
- 避免隐式取消选择：`avoidImplicitDeselect`
- click 选择 / 取消选择
- Shift 区间选择
- 多选拖拽时折叠和展开动画
- drop 后批量插入
- 静态工具：`select(el)` / `deselect(el)`

事件额外字段：

- `items`
- `clones`
- `oldIndicies`
- `newIndicies`

### OnSpill

OnSpill 处理拖出容器后释放：

- `revertOnSpill`：回到原位置。
- `removeOnSpill`：从 DOM 移除。
- 额外派发 `spill`。

## Sortable 原实现的问题

需要在 `SortableBox` 中规避：

- 大量模块级全局状态，实例隔离较差。
- 同时支持原生 DnD 和 fallback，自身复杂度高。
- 旧浏览器兼容代码多，现代 Vue 项目不需要。
- 拖动中直接移动 DOM，和 Vue 数据源存在冲突。
- 插件生命周期隐式耦合重，插件能取消核心流程并操作内部 clone/ghost。
- DOM 读写交错较多，可能导致布局抖动。
- 事件同时走 DOM CustomEvent 和 options callback，Vue 中可以收敛为 emits。

## vue.draggable.next 核心模型

vue.draggable.next 没有重写拖拽，它只是 Sortable 的 Vue 适配层。

主要职责：

- 渲染 `realList`。
- 给每个 item 根节点加 `data-draggable`。
- 初始化 Sortable。
- 把 attrs 转成 Sortable options。
- 拦截 Sortable 事件并同步数组。
- 派发 Vue 事件。

## vue.draggable.next 组件 API

主要 props：

- `list`
- `modelValue`
- `itemKey`
- `clone`
- `tag`
- `move`
- `componentData`

约束：

- `list` 和 `modelValue` 互斥。
- `itemKey` 必填。
- `item` slot 必填。
- `item` slot 每个元素只能渲染一个根节点。

slots：

- `item`
- `header`
- `footer`

events：

- `update:modelValue`
- `change`
- `start`
- `add`
- `remove`
- `update`
- `end`
- `choose`
- `unchoose`
- `sort`
- `filter`
- `clone`

`move` 不作为事件，而是 prop。它会收到扩展过的 Sortable move event。

## vue.draggable.next 数据同步

它通过 DOM 节点私有字段保存上下文：

- `__draggable_context.element`
- `__draggable_context.index`

拖动开始：

- 从 DOM 节点拿到当前数组项。
- 使用 `clone` prop 生成可能插入目标列表的元素。
- 暂存到 `evt.item._underlying_vm_`。

拖入新列表：

- `onDragAdd`
- 从 `evt.item._underlying_vm_` 拿元素。
- 删除 Sortable 插入的 DOM 节点。
- 根据 DOM index 计算 VM index。
- 向目标数组插入元素。
- 派发 `change: { added }`。

拖出列表：

- `onDragRemove`
- 先把 DOM 还原到旧位置，让 Vue 接管渲染。
- 如果 `pullMode === 'clone'`，只删除 clone，不改源数组。
- 否则从源数组删除元素。
- 派发 `change: { removed }`。

同列表移动：

- `onDragUpdate`
- 删除 Sortable 移动后的 DOM。
- 插回旧位置，让 Vue 接管渲染。
- 根据 DOM index 计算 VM index。
- 调整数组顺序。
- 派发 `change: { moved }`。

`modelValue` 和 `list` 的差异：

- `list`：直接用 `splice` 修改原数组。
- `modelValue`：复制数组，修改副本后 emit `update:modelValue`。

## vue.draggable.next move 扩展

`move` prop 会收到类似 Sortable `onMove` 的事件，并额外添加：

- `draggedContext`
- `relatedContext`
- `futureIndex`

`futureIndex` 通过目标 DOM index 和 `willInsertAfter` 计算。

## vue.draggable.next 的问题

重写 `SortableBox` 时需要避免：

- Vue 层强依赖 Sortable 的 DOM-first 行为，所以需要频繁把 DOM 还原给 Vue。
- 用 DOM 私有字段挂 VM context，容易和外部 DOM 操作耦合。
- 非 HTML attrs 全部透传为 Sortable options，类型不够清晰。
- 事件名和 option callback 混杂，需要过滤 `onStart/onEnd` 等只读事件。
- `draggingElement` 也是模块级全局状态。

## SortableBox 重写建议

### 底层拖拽引擎

建议统一使用 Pointer Events：

- `pointerdown`
- `pointermove`
- `pointerup`
- `pointercancel`

不复刻 HTML5 Drag and Drop。

好处：

- 鼠标、触控、触控笔路径统一。
- 不需要 `forceFallback` 分支。
- 不需要 `dataTransfer`。
- ghost / placeholder 行为完全可控。

如果项目明确不考虑移动端，可以进一步收窄：

- 不处理 `touchstart` / `touchmove` / `touchend`。
- 不保留 `delayOnTouchOnly`。
- 不保留 `touchStartThreshold`。
- 不需要 iOS / Android / Safari mobile 特判。
- 不需要移动端滚动和 ghost 定位补偿逻辑。
- Pointer Events 仍可作为桌面主路径使用，但只接受 `pointerType === 'mouse'` 或不区分 pointerType。

这会显著降低实现复杂度。

### 状态设计

建议分两层：

实例状态：

- 容器元素
- 当前 options
- 当前 item 列表
- 当前 rect 缓存
- 当前 placeholder
- 当前动画状态

全局拖拽 registry：

- active instance
- source instance
- target instance
- dragged element
- dragged data
- pointer 坐标
- ghost element
- clone element

全局 registry 只保存一次拖拽必要状态，拖拽结束必须完整清理。

### Vue 数据优先

`SortableBox` 最好把数据作为排序真相来源。

可选实现路线：

1. 拖动中只移动 placeholder 和 ghost，不直接长期移动真实 item。
2. 用 pointer 命中的目标 index 计算未来顺序。
3. drop 时更新 `modelValue/list`。
4. Vue 重新渲染真实 DOM。

这比 Sortable 的 DOM-first 模式更适合 Vue，但需要做好拖动中的视觉反馈。

### Vue 一体化后的可删减适配

如果 `SortableBox` 直接实现拖拽引擎，而不是把 Sortable 包一层 Vue 适配，则可以删除很多中间层逻辑。

不再需要：

- Sortable 的 DOM CustomEvent。
- `onStart/onEnd/onAdd` 这类 option callback 转 Vue emit 的映射层。
- `data-draggable` 强制属性。
- DOM 节点上的 `__draggable_context`。
- `evt.item._underlying_vm_` 临时挂载。
- `draggingElement` 这种模块级全局变量。
- 拖动后把 Sortable 移动过的 DOM 再插回原位，让 Vue 接管渲染。
- 从 DOM index 反推 VM index 的复杂逻辑。
- header / footer 导致的 DOM index 修正。
- `componentStructure` 这类专门为了桥接 Sortable DOM 行为的结构。

可以改成：

- 用 `itemKey` 建立 `key -> item` 和 `key -> element` 映射。
- 用 Vue 渲染列表，拖拽时只维护 ghost 和 placeholder。
- 用指针位置命中的 item key 计算目标 index。
- drop 时直接更新 `modelValue` 或 `list`。
- 所有事件统一用 Vue emits。
- `move` 可以直接拿到 `draggedContext`、`relatedContext`、`futureIndex`，不需要从 Sortable event 扩展。

### Vue 优化点

可以利用 Vue 的数据和渲染模型做这些优化：

- 数据优先：排序结果来自数组变更，而不是 DOM 最终顺序。
- 类型明确：props 和 emits 显式定义，不把未知 attrs 全部透传为 Sortable option。
- 渲染稳定：`itemKey` 是核心，内部通过 key 映射元素，不依赖 DOM 私有字段。
- DOM 写入少：拖动中只移动 ghost / placeholder，真实列表主要由 Vue 更新。
- 动画更可控：在数据更新前捕获 rect，`nextTick` 后做 FLIP。
- header / footer 更简单：它们天然不在 items 数组里，不需要通过 DOM index 猜测。
- 多选更自然：MultiDrag 可以用 selected key 集合表达，而不是只靠 DOM class。
- 事件模型更干净：只 emit Vue 事件，不再同时维护 DOM event 和 option callback。
- 实例隔离更好：每个 `SortableBox` 管自己的容器和 item refs，跨容器只通过全局 active drag registry 协调。
- SSR 更清晰：render 阶段不访问 DOM，拖拽引擎只在 mounted 后启用。

### 可以删除或降级的 Sortable 能力

在“不考虑移动端、不考虑旧浏览器、Vue 一体化”的前提下，以下能力建议删除或降级为兼容空实现：

- `forceFallback`
- `fallbackClass`
- `fallbackOnBody`
- `fallbackTolerance`
- `fallbackOffset`
- `setData`
- `delayOnTouchOnly`
- `touchStartThreshold`
- `supportPointer`
- 原生 HTML5 DnD 相关 `dragstart/dragover/drop/dataTransfer`
- IE / Edge Legacy / iOS / Android / Safari mobile 特判

仍建议保留的能力：

- `delay`，桌面端也可能用于避免误拖。
- `handle-class`
- `filter`
- `preventOnFilter`
- `group`
- `clone`
- `sort`
- `disabled`
- `direction`
- `swapThreshold`
- `invertSwap`
- `invertedSwapThreshold`
- `animation`
- `easing`
- `emptyInsertThreshold`
- `scroll`
- `swap`
- `multiDrag`
- `revertOnSpill`
- `removeOnSpill`

## 功能语义层优化

Sortable 原始能力偏 DOM 排序，业务规则通常只能通过 `onMove` 返回 `false` 实现。`SortableBox` 如果直接面向 Vue 数据模型，可以把一些常见业务场景做成一等能力。

### 不可移除子列表

场景：

- 一个子列表必须保留至少一个元素。
- 某些节点只能在当前父级内排序，不能拖出父级。
- 某些节点可以拖入，但不能拖出。

Sortable 原方案：

- 在 `onMove` 中判断来源、目标、元素和索引。
- 返回 `false` 阻止移动。
- 规则分散在事件回调里，难以复用和声明。

SortableBox 可优化为声明式规则：

- `canDrag`
- `canLeave`
- `canEnter`
- `canDrop`
- `canSort`
- `minItems`
- `maxItems`
- `lockedKeys`
- `removable`

示例语义：

```ts
type SortableGuardContext<T> = {
  item: T
  key: string | number
  from: SortableListContext<T>
  to: SortableListContext<T>
  oldIndex: number
  newIndex: number
}
```

这样“不能移除该子列表”可以表达为：

- 当前列表 `minItems: 1`
- 或当前 item `canLeave: false`
- 或 guard 返回 `{ allowed: false, reason: 'min-items' }`

组件可以据此阻止拖拽、禁止 drop、显示禁用态，而不是只在最后的 move callback 里取消。

### 固定源列表

场景：

- 组件库拖入画布。
- 左侧组件库元素可拖动，但组件库自身不排序、不减少元素。
- 拖入画布时创建一个新实例。

Sortable 原方案：

- 通常用 `sort: false` + `group.pull: 'clone'` + `group.put: false`。
- 仍然围绕 DOM clone 和 group 规则理解。

SortableBox 可优化为明确的列表模式：

- `mode: 'sortable'`：普通可排序列表。
- `mode: 'source'`：只作为拖拽源，不排序、不接收、不移除。
- `mode: 'target'`：只接收，不允许拖出或内部排序可配置。
- `mode: 'readonly'`：完全只读。

固定源列表建议能力：

- `sort: false`
- `pull: 'clone'`
- `put: false`
- `clone` 或 `createItem` 生成目标数据。
- 源列表拖动中不出现真实占位，不改变源数组。
- 目标列表接收的是新数据，而不是源数据引用。

这比直接暴露 Sortable 的 `group.pull = 'clone'` 更贴近“组件库 -> 画布”的业务语义。

### 双列表实时状态同步

场景：

- 图层列表和画布是同一批对象的两种视图。
- 在图层列表拖动排序时，画布希望实时预览层级变化。
- 在画布拖动元素时，图层列表希望实时预览顺序或选中状态。

Sortable 原方案：

- 一个列表拖动完成后触发 `end/update`。
- 业务方在结束后手动设置另一个列表。
- 另一个列表没有拖动中的实时预览，除非业务方自己写一套临时状态。

SortableBox 可优化为“拖拽事务 + 实时预览”：

- 拖动开始创建 drag transaction。
- 每次 hover 产生 preview operation。
- 组件 emit `preview-change`，包含虚拟排序结果。
- drop 时 emit `change` / `update:modelValue`。
- cancel 时 emit `preview-cancel`。

可能的事件：

- `preview-start`
- `preview-change`
- `preview-cancel`
- `preview-commit`

`preview-change` 可以携带：

```ts
type SortablePreviewChange<T> = {
  dragging: T
  operation: 'move' | 'clone' | 'remove' | 'swap'
  source: SortableListContext<T>
  target: SortableListContext<T>
  sourcePreview: T[]
  targetPreview: T[]
  oldIndex: number
  newIndex: number
}
```

对图层和画布这种双视图场景，可以提供两种方案：

1. 事件驱动：
   - `SortableBox` 只 emit preview。
   - 业务方把 preview 状态同步给画布或图层。

2. 共享控制器：
   - 多个 `SortableBox` 绑定同一个 `dragSyncKey` 或 controller。
   - 同一组内的列表能收到同一拖拽事务的 preview。
   - 适合图层列表、画布、属性面板联动。

推荐先做事件驱动，再评估是否需要内置共享控制器。

### 建议新增的业务级 API

可以考虑在 SortableBox 上加入这些高层 API：

- `mode`
- `canDrag`
- `canLeave`
- `canEnter`
- `canDrop`
- `canSort`
- `minItems`
- `maxItems`
- `lockedKeys`
- `createItem`
- `preview`
- `previewMode`
- `dragSyncKey`

这些 API 不替代底层 `move`，而是把常见规则前置成声明式能力。`move` 仍然可以作为最终兜底。

### 嵌套列表优化

Sortable 原方案：

- 嵌套列表依赖多个 Sortable 实例。
- 通过 DOM 父链查找目标容器。
- 通过 `dragoverBubble` 控制是否继续向父级冒泡。
- 通过 `emptyInsertThreshold` 处理空子列表。
- 事件只给 `oldIndex/newIndex`，父子路径需要业务方自己推断。

这些机制能工作，但对 Vue 树形数据不够友好。

SortableBox 可以把嵌套列表分成两类：

1. 独立嵌套容器：
   - 每个子列表是一个 `SortableBox`。
   - 适合多个普通列表互相嵌套。

2. 树形排序：
   - 一个 `SortableBox` 管理整棵树。
   - 通过 `childrenKey` 识别子节点。
   - 渲染时可以扁平化可见节点。
   - 拖动时直接计算 tree operation。

如果目标是树形结构，推荐第二种。

树形排序建议 API：

- `tree`
- `childrenKey`
- `expandedKeys`
- `indent`
- `maxDepth`
- `canNest`
- `canUnnest`
- `canDropPosition`
- `defaultDropPosition`

drop 位置不应只靠 before/after，可以显式区分：

- `before`
- `after`
- `inside`

示例事件字段：

```ts
type SortableTreeChange<T> = {
  item: T
  oldPath: number[]
  newPath: number[]
  oldParentKey: string | number | null
  newParentKey: string | number | null
  position: 'before' | 'after' | 'inside'
  depth: number
}
```

可优化的嵌套边界：

- 禁止把父节点拖进自己的后代，避免循环引用。
- 支持 `maxDepth` 限制最大层级。
- 支持某些节点不允许有 children。
- 支持某些节点不能被拖出当前父级。
- 支持拖到折叠节点上时延迟自动展开。
- 支持空 children 直接显示子级 placeholder，而不是靠空 DOM 容器阈值。
- 支持拖动整棵子树，children 跟随父节点移动。
- 支持 `oldPath/newPath`，避免业务方从 index 反推路径。
- 支持缩进线、drop indicator 和 inside 区域，减少嵌套拖放歧义。

树形实现建议：

- 内部维护 visible flat list：`[{ item, key, parentKey, path, depth }]`。
- 拖动命中 flat item 后，根据 pointer 横向位置和纵向区域计算 `before/after/inside`。
- preview 阶段生成虚拟 tree。
- drop 阶段提交 tree 变更。

这种方式比递归嵌套多个 Sortable 实例更适合“图层树、菜单树、页面结构树”等场景。

### API 建议

保留 vue.draggable.next 的核心 Vue API：

- `v-model`
- `list`
- `itemKey`
- `tag`
- `componentData`
- `clone`
- `move`
- `item` slot
- `header` slot
- `footer` slot

同时吸收 Sortable 的核心 options：

- `group`
- `sort`
- `disabled`
- `handle`
- `filter`
- `preventOnFilter`
- `direction`
- `swapThreshold`
- `invertSwap`
- `invertedSwapThreshold`
- `animation`
- `easing`
- `ghostClass`
- `chosenClass`
- `dragClass`
- `emptyInsertThreshold`
- `scroll`
- `scrollSensitivity`
- `scrollSpeed`
- `bubbleScroll`
- `swap`
- `swapClass`
- `multiDrag`
- `selectedClass`
- `multiDragKey`
- `avoidImplicitDeselect`
- `revertOnSpill`
- `removeOnSpill`

不建议继续暴露或仅兼容空实现：

- `forceFallback`
- `fallbackClass`
- `fallbackOnBody`
- `fallbackTolerance`
- `fallbackOffset`
- `setData`

### 后续需要确认的问题

1. 是否要求 Sortable API 级别兼容，还是 Vue 组件体验优先？
2. `forceFallback` 等旧 API 是删除、保留但无效、还是用新语义实现？
3. MultiDrag 是否第一版必须完整实现？
4. Swap / OnSpill 是否作为普通 props 内置实现？
5. 是否允许新增纯 TS 拖拽引擎文件，例如 `scripts/sortable-box/sortable.ts`？
6. 是否需要提供实例方法：
   - `option`
   - `toArray`
   - `sort`
   - `select`
   - `deselect`
   - `destroy`

## 建议下一步

先确定 `SortableBox` 第一版能力边界。

推荐拆成两步实现：

1. 第一阶段实现核心排序能力：
   - 单列表排序
   - 跨列表
   - clone
   - handle-class/filter
   - direction/threshold
   - animation
   - auto scroll
   - Vue 数据同步

2. 第二阶段实现高级能力：
   - swap
   - multiDrag
   - revertOnSpill
   - removeOnSpill
   - 对外方法

如果要求“全部功能第一版一次完成”，也可以做，但建议先写底层拖拽引擎，再包 Vue 组件，避免组件和拖拽算法耦合过深。

## 第一版实现记录

当前第一版实现位置：

- `scripts/sortable-box/SortableBox.vue`
- `scripts/sortable-box/types.ts`
- `scripts/sortable-box/index.ts`
- `site/pages/SortableBoxDemo.vue`

已落地能力：

- Vue 数据优先实现，不复用 Sortable。
- 桌面 Pointer Events 拖拽。
- 不生成 item 包裹 DOM，直接 clone `item` slot 的唯一根节点并注入拖拽属性。
- 组件本体不提供列表间距、padding、边框等布局样式。
- `v-model` / `list` 两种数据源。
- `itemKey`。
- `item` / `header` / `footer` slots。
- 单列表排序。
- 跨列表拖动。
- `mode: 'source'` 固定源列表。
- `group` 字符串和基础对象形式。
- `clone` / `createItem`。
- `minItems` / `maxItems`。
- `lockedKeys`。
- `canDrag` / `canLeave` / `canEnter` / `canDrop` / `canSort`。
- `move` 兜底回调。
- `filter` / `handle-class`，其中 `handle-class` 用于按 class name 指定拖拽句柄。
- 实时 preview 渲染。
- AutoScroll，支持 `scroll` / `scrollSensitivity` / `scrollSpeed` / `bubbleScroll`。
- `swapThreshold` / `invertSwap` / `invertedSwapThreshold` 的基础插入阈值判定。
- `emptyInsertThreshold`，允许指针靠近空容器时命中空列表。
- FLIP 位移动画，支持 `animation` / `easing`。
- `preview-start` / `preview-change` / `preview-cancel` / `preview-commit`。
- `change` 事件，包含 `added` / `removed` / `moved`。
- 基础 `choose` / `unchoose` / `start` / `end` / `add` / `remove` / `update` / `sort` / `filter`。
- `option` / `toArray` / `sort` 暴露方法，其中 `option(name, value)` 可在运行时覆盖组件选项。

暂未落地能力：

- 移动端 touch 专项处理。
- HTML5 DnD / `dataTransfer`。
- Swap 模式。
- MultiDrag。
- OnSpill。
- Tree 模式。
- 共享 controller / `dragSyncKey`。
- `maxDepth` / `childrenKey` / `oldPath` / `newPath`。

第一版有意保留的取舍：

- 拖动过程中用 preview 数组驱动 Vue 重新渲染，而不是直接移动真实 DOM。
- 真实拖动视觉使用 ghost clone。
- 拖动 ghost 保持原元素视觉，不默认添加阴影、透明度、间距等装饰样式。
- `ghost-class` 作用在跟随鼠标的 ghost clone 上；源容器中隐藏的原元素使用内部 class 和可配置 `drag-class`。
- source 列表不会隐藏原始元素，也不会产生源列表占位。
- 不把未知 attrs 透传成底层拖拽 options。
