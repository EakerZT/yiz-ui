<template>
  <div ref="tableWrapperRef" class="yiz-table-wrapper" :class="vClass">
    <!-- Header table -->
    <div class="yiz-table-header-wrapper" ref="headerWrapperRef">
      <table class="yiz-table-header-table">
        <colgroup>
          <col v-for="col in displayColumns" :key="col.field" :style="{ width: colWidth(col) }" />
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="col in displayColumns"
              :key="col.field"
              class="yiz-table-th"
              :class="{
                'yiz-table-sortable': col.sortable,
                'yiz-table-resizing': resizing === col.field,
                'yiz-table-fixed': col.fixed !== 'none',
                'yiz-table-fixed-left': col.fixed === 'left',
                'yiz-table-fixed-right': col.fixed === 'right',
                'yiz-table-last-non-fixed': borderMarkerFields.lastNonFixed === col.field,
                'yiz-table-first-right-fixed': borderMarkerFields.firstRightFixed === col.field
              }"
              :style="{ textAlign: col.align || 'left', ...getCellStyle(col) }"
              @click="col.sortable && onSort(col)"
            >
              <label
                v-if="col.field === '__yiz_select' && selectMode === 'multi'"
                class="yiz-table-select-cell"
                @click.stop
              >
                <Checkbox v-model:checked="headerChecked" />
              </label>
              <span v-else class="yiz-table-th-label">{{ col.label }}</span>
              <span v-if="col.sortable" class="yiz-table-sort">
                <span class="yiz-table-sort-icon" :class="{ active: sortKey === col.field && sortOrder === 'asc' }"
                  >▲</span
                >
                <span class="yiz-table-sort-icon" :class="{ active: sortKey === col.field && sortOrder === 'desc' }"
                  >▼</span
                >
              </span>
              <span
                v-if="resize && col.field !== '__yiz_select' && col.field !== '__yiz_row_no'"
                class="yiz-table-resize-handle"
                @mousedown.stop="onResizeStart($event, col)"
                @click.stop
              />
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- Body table -->
    <ScrollBox ref="bodyScrollBoxRef" class="yiz-table-body-scrollbox" :z-index="4" @scroll="onBodyScroll">
      <table class="yiz-table-body-table" :class="{ 'yiz-table-no-overflow': !bodyHasOverflow }">
        <colgroup>
          <col v-for="col in displayColumns" :key="col.field" :style="{ width: colWidth(col) }" />
        </colgroup>
        <tbody>
          <tr v-if="sortedData.length === 0">
            <td :colspan="displayColumns.length" class="yiz-table-td yiz-table-empty-cell">
              <slot name="empty">
                <div class="yiz-table-empty">暂无数据</div>
              </slot>
            </td>
          </tr>
          <tr
            v-for="(row, idx) in sortedData"
            :key="idx"
            :class="{ 'yiz-table-row-stripe': stripe && idx % 2 === 1 }"
          >
            <td
              v-for="col in displayColumns"
              :key="col.field"
              class="yiz-table-td"
              :class="{
                'yiz-table-fixed': col.fixed !== 'none',
                'yiz-table-fixed-left': col.fixed === 'left',
                'yiz-table-fixed-right': col.fixed === 'right',
                'yiz-table-last-non-fixed': borderMarkerFields.lastNonFixed === col.field,
                'yiz-table-first-right-fixed': borderMarkerFields.firstRightFixed === col.field
              }"
              :style="{ textAlign: col.align || 'left', ...getCellStyle(col) }"
            >
              <template v-if="col.field === '__yiz_select'">
                <label class="yiz-table-select-cell" @click.stop>
                  <Radio
                    v-if="selectMode === 'single'"
                    v-model="selected"
                    :value="getRowKey(row, idx)"
                    :disabled="isRowDisabled(row, idx)"
                  />
                  <Checkbox
                    v-else
                    :checked="isSelected(row, idx)"
                    :disabled="isRowDisabled(row, idx)"
                    @update:checked="toggleSelect(row, idx)"
                  />
                </label>
              </template>
              <template v-else-if="col.field === '__yiz_row_no'">
                {{ idx + 1 }}
              </template>
              <template v-else>
                <CellRenderer
                  v-if="col.renderFn"
                  :render-fn="col.renderFn"
                  :value="row[col.field]"
                  :row="row"
                  :index="idx"
                />
                <span v-else>{{ row[col.field] }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </ScrollBox>

    <div style="display: none"><slot /></div>
  </div>
  <Teleport to="body">
    <div v-if="resizing" class="yiz-table-resize-tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
      宽度:{{ tooltipWidth }}px
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, provide, ref, useSlots } from 'vue'
import TableColumnComp from './TableColumn.vue'
import CellRenderer from './CellRenderer.vue'
import Checkbox from '../checkbox/Checkbox.vue'
import Radio from '../radio/Radio.vue'
import { ScrollBox } from '../scroll-box'

export interface TableColumn {
  label: string
  field: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  maxWidth?: number
  fixed?: 'none' | 'left' | 'right'
  renderFn?: (scope: { value: any; row: Record<string, any>; index: number }) => any
}

const slots = useSlots()

const selected = defineModel<any>('selected')

const props = withDefaults(
  defineProps<{
    data?: Record<string, any>[]
    bordered?: boolean
    stripe?: boolean
    size?: 'default' | 'small'
    resize?: boolean
    no?: boolean
    selectMode?: 'none' | 'single' | 'multi'
    rowKey?: string
    selectDisabled?: (row: Record<string, any>, index: number) => boolean
  }>(),
  {
    data: () => [],
    bordered: false,
    stripe: false,
    size: 'default',
    resize: false,
    no: false,
    selectMode: 'none',
    selectDisabled: undefined
  }
)

const columns = computed(() => {
  const nodes = slots.default?.() ?? []
  const cols: TableColumn[] = []
  for (const vnode of nodes) {
    if (vnode.type === TableColumnComp && vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.field) {
        const vnodeSlots = (vnode as any).children
        const defaultSlot =
          vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.default === 'function'
            ? vnodeSlots.default
            : undefined
        const minWidth = p.minWidth ?? p['min-width']
        const maxWidth = p.maxWidth ?? p['max-width']
        const fixed = p.fixed ?? 'none'
        cols.push({
          label: p.label ?? '',
          field: p.field,
          width: p.width,
          sortable: p.sortable ?? false,
          align: p.align ?? 'left',
          minWidth: minWidth != null ? Number(minWidth) : undefined,
          maxWidth: maxWidth != null ? Number(maxWidth) : undefined,
          fixed: (fixed as 'none' | 'left' | 'right') || 'none',
          renderFn: defaultSlot
        })
      }
    }
  }
  return cols
})

const displayColumns = computed<TableColumn[]>(() => {
  const result: TableColumn[] = []
  if (props.selectMode !== 'none') {
    result.push({ label: '', field: '__yiz_select', width: '48px', align: 'center', fixed: 'left' })
  }
  if (props.no) {
    result.push({ label: '#', field: '__yiz_row_no', width: '60px', align: 'center', fixed: 'left' })
  }

  const leftFixed: TableColumn[] = []
  const normal: TableColumn[] = []
  const rightFixed: TableColumn[] = []

  for (const col of columns.value) {
    if (col.fixed === 'left') leftFixed.push(col)
    else if (col.fixed === 'right') rightFixed.push(col)
    else normal.push(col)
  }

  result.push(...leftFixed, ...normal, ...rightFixed)
  return result
})

const borderMarkerFields = computed(() => {
  const cols = displayColumns.value
  let lastNonFixed: string | null = null
  let firstRightFixed: string | null = null
  for (let i = 0; i < cols.length; i++) {
    if (cols[i].fixed === 'none' && i + 1 < cols.length && cols[i + 1].fixed === 'right') {
      lastNonFixed = cols[i].field
    }
  }
  for (let i = 0; i < cols.length; i++) {
    if (cols[i].fixed === 'right' && i > 0 && cols[i - 1].fixed === 'none') {
      firstRightFixed = cols[i].field
      break
    }
  }
  return { lastNonFixed, firstRightFixed }
})

const fixedOffsets = computed(() => {
  const offsets: Record<string, { left?: string; right?: string }> = {}
  const cols = displayColumns.value
  const widths = columnWidths.value

  let leftPx = 0
  for (const col of cols) {
    if (col.fixed === 'left') {
      offsets[col.field] = { left: `${leftPx}px` }
      const w = parseFloat(widths[col.field] || col.width || '0')
      leftPx += w || 0
    }
  }

  let rightPx = 0
  for (let i = cols.length - 1; i >= 0; i--) {
    const col = cols[i]
    if (col.fixed === 'right') {
      offsets[col.field] = { right: `${rightPx}px` }
      const w = parseFloat(widths[col.field] || col.width || '0')
      rightPx += w || 0
    }
  }

  return offsets
})

function colWidth(col: TableColumn): string {
  return columnWidths.value[col.field] || col.width || 'auto'
}

function getCellStyle(col: TableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  if (col.fixed === 'left') {
    style.position = 'sticky'
    style.left = fixedOffsets.value[col.field]?.left || '0'
    style.zIndex = '2'
  } else if (col.fixed === 'right') {
    style.position = 'sticky'
    style.right = fixedOffsets.value[col.field]?.right || '0'
    style.zIndex = '2'
  }
  return style
}

function getRowKey(row: Record<string, any>, index: number) {
  return props.rowKey ? row[props.rowKey] : index
}

function isRowDisabled(row: Record<string, any>, index: number) {
  return props.selectDisabled ? props.selectDisabled(row, index) : false
}

function isSelected(row: Record<string, any>, index: number) {
  if (props.selectMode === 'single') return selected.value === getRowKey(row, index)
  if (props.selectMode === 'multi') return (selected.value ?? []).includes(getRowKey(row, index))
  return false
}

function getSelectedRows() {
  if (props.selectMode === 'none') return null
  if (props.selectMode === 'single') {
    if (selected.value == null) return null
    const idx = sortedData.value.findIndex((row, i) => getRowKey(row, i) === selected.value)
    return idx >= 0 ? sortedData.value[idx] : null
  }
  const keys = (selected.value ?? []) as any[]
  return sortedData.value.filter((row, i) => keys.includes(getRowKey(row, i)))
}

function toggleSelect(row: Record<string, any>, index: number) {
  if (isRowDisabled(row, index)) return
  const key = getRowKey(row, index)
  if (props.selectMode === 'single') {
    selected.value = selected.value === key ? null : key
  } else if (props.selectMode === 'multi') {
    const arr = [...(selected.value ?? [])]
    const idx = arr.indexOf(key)
    if (idx >= 0) arr.splice(idx, 1)
    else arr.push(key)
    selected.value = arr
  }
  emit('select', getSelectedRows())
}

const allSelected = computed(() => {
  if (props.selectMode !== 'multi') return false
  const selectableCount = sortedData.value.filter((row, i) => !isRowDisabled(row, i)).length
  const keys = (selected.value ?? []) as any[]
  return selectableCount > 0 && keys.length === selectableCount
})

const headerChecked = computed({
  get: () => allSelected.value,
  set: (v: boolean) => {
    if (props.selectMode !== 'multi') return
    if (v) {
      const keys: any[] = []
      sortedData.value.forEach((row, i) => {
        if (!isRowDisabled(row, i)) keys.push(getRowKey(row, i))
      })
      selected.value = keys
    } else {
      selected.value = []
    }
    emit('select', getSelectedRows())
  }
})

function registerColumn(col: TableColumn) {
  // kept for dynamic registration if needed
}

provide('yizTableRegisterColumn', registerColumn)

const emit = defineEmits<{
  select: [selected: Record<string, any> | Record<string, any>[] | null]
}>()

defineSlots<{
  default?: any
  empty?: any
}>()

const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  const sorted = [...props.data]
  sorted.sort((a, b) => {
    const va = a[sortKey.value]
    const vb = b[sortKey.value]
    if (va == null) return 1
    if (vb == null) return -1
    if (typeof va === 'number' && typeof vb === 'number') {
      return sortOrder.value === 'asc' ? va - vb : vb - va
    }
    const sa = String(va)
    const sb = String(vb)
    return sortOrder.value === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
  })
  return sorted
})

function onSort(col: TableColumn) {
  if (sortKey.value === col.field) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      sortKey.value = ''
      sortOrder.value = 'asc'
    }
  } else {
    sortKey.value = col.field
    sortOrder.value = 'asc'
  }
}

const vClass = computed(() => ({
  'yiz-table-bordered': props.bordered,
  'yiz-table-stripe': props.stripe,
  [`yiz-table-${props.size}`]: props.size !== 'default',
  'yiz-table-resizable': props.resize
}))

const tableWrapperRef = ref<HTMLDivElement>()
const headerWrapperRef = ref<HTMLDivElement>()
const bodyScrollBoxRef = ref<InstanceType<typeof ScrollBox>>()
const columnWidths = ref<Record<string, string>>({})

function computeWidths() {
  const wrapper = tableWrapperRef.value
  if (!wrapper) return
  const tableWidth = wrapper.clientWidth
  const cols = displayColumns.value
  if (cols.length === 0) return

  const fixedFields = new Set(['__yiz_select', '__yiz_row_no'])
  const widths: Record<string, string> = {}
  let fixedSpace = 0

  for (const col of cols) {
    if (fixedFields.has(col.field) && col.width) {
      widths[col.field] = col.width
      fixedSpace += parseFloat(col.width)
    }
  }

  const userCols = cols.filter((c) => !fixedFields.has(c.field))
  if (userCols.length === 0) {
    columnWidths.value = widths
    return
  }

  const remainingWidth = tableWidth - fixedSpace
  let totalFixed = 0
  const parsed: number[] = []
  for (const col of userCols) {
    const num = col.width ? parseFloat(col.width) : NaN
    if (!isNaN(num)) {
      parsed.push(num)
      totalFixed += num
    } else {
      parsed.push(0)
    }
  }

  if (totalFixed > 0 && totalFixed >= remainingWidth) {
    for (let i = 0; i < userCols.length; i++) {
      if (parsed[i] > 0) {
        widths[userCols[i].field] = `${parsed[i]}px`
      }
    }
  } else {
    const extraPerCol = (remainingWidth - totalFixed) / userCols.length
    for (let i = 0; i < userCols.length; i++) {
      widths[userCols[i].field] = `${parsed[i] + extraPerCol}px`
    }
  }
  columnWidths.value = widths
}

const bodyHasOverflow = ref(false)

function checkBodyOverflow() {
  const vp = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  if (vp) {
    bodyHasOverflow.value = vp.scrollHeight > vp.clientHeight + 1
  }
}

function onBodyScroll() {
  const bodyViewport = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  if (headerWrapperRef.value && bodyViewport) {
    headerWrapperRef.value.scrollLeft = bodyViewport.scrollLeft
  }
  checkBodyOverflow()
}

onMounted(() => {
  nextTick(() => {
    computeWidths()
    onBodyScroll()
  })
})

const resizing = ref<string | null>(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipWidth = ref(0)

function onResizeStart(e: MouseEvent, col: TableColumn) {
  const th = (e.target as HTMLElement).closest('.yiz-table-th') as HTMLElement
  if (!th) return

  const allThs = th.parentElement?.querySelectorAll('.yiz-table-th')
  const widths: Record<string, string> = { ...columnWidths.value }
  const cols = displayColumns.value
  if (allThs) {
    allThs.forEach((thEl, i) => {
      if (i < cols.length && cols[i].fixed === 'none') {
        widths[cols[i].field] = `${thEl.offsetWidth}px`
      }
    })
  }
  columnWidths.value = widths

  resizing.value = col.field
  resizeStartX.value = e.clientX
  resizeStartWidth.value = th.offsetWidth
  tooltipWidth.value = th.offsetWidth
  tooltipX.value = e.clientX
  tooltipY.value = e.clientY - 32
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'
}

function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  const col = displayColumns.value.find((c) => c.field === resizing.value)
  const delta = e.clientX - resizeStartX.value
  let newWidth = Math.max(col?.minWidth ?? 40, resizeStartWidth.value + delta)
  if (col?.maxWidth != null) {
    newWidth = Math.min(col.maxWidth, newWidth)
  }
  const widths = { ...columnWidths.value }
  widths[resizing.value] = `${newWidth}px`
  columnWidths.value = widths
  tooltipWidth.value = Math.round(newWidth)
  tooltipX.value = e.clientX
  tooltipY.value = e.clientY - 32
}

function onResizeEnd() {
  resizing.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
})
</script>

<style lang="less">
.yiz-table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.yiz-table-header-wrapper {
  flex-shrink: 0;
  overflow: hidden;
}

.yiz-table-body-scrollbox {
  flex: 1;
  min-height: 0;
}

.yiz-table-bordered .yiz-table-body-scrollbox {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-header-table,
.yiz-table-body-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  box-sizing: border-box;
}

// th / td base
.yiz-table-th {
  position: relative;
  box-sizing: border-box;
  background: #fafafa;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  white-space: nowrap;
  user-select: none;
}

.yiz-table-td {
  box-sizing: border-box;
  padding: 12px 16px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  background: #fff;
  word-break: break-all;
}

.yiz-table-body-table tbody tr:hover .yiz-table-td {
  background: #f5f7fa;
}

// bordered
.yiz-table-bordered {
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-bottom: none;
}

.yiz-table-bordered .yiz-table-th,
.yiz-table-bordered .yiz-table-td {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-bordered .yiz-table-th:last-child,
.yiz-table-bordered .yiz-table-td:last-child {
  border-right: none;
}

.yiz-table-bordered .yiz-table-body-table tbody tr:last-child .yiz-table-td {
  border-bottom: none;
}

/* 内容不溢出时，最后一行恢复下边框 */
.yiz-table-bordered .yiz-table-body-table.yiz-table-no-overflow tbody tr:last-child .yiz-table-td {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

// stripe
.yiz-table-stripe .yiz-table-body-table tbody .yiz-table-row-stripe .yiz-table-td {
  background: #fafafa;
}

.yiz-table-stripe .yiz-table-body-table tbody .yiz-table-row-stripe:hover .yiz-table-td {
  background: #f0f2f5;
}

// size
.yiz-table-small {
  .yiz-table-th,
  .yiz-table-td {
    padding: 8px 12px;
    font-size: 13px;
  }
}

// sort
.yiz-table-sortable {
  cursor: pointer;

  &:hover {
    background: #f0f2f5;
  }
}

.yiz-table-sort {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  margin-left: 4px;
  line-height: 0.6;
}

.yiz-table-sort-icon {
  font-size: 10px;
  color: #c0c4cc;
  transition: color 0.2s;

  &.active {
    color: var(--yiz-color-primary);
  }
}

// select
.yiz-table-select-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

// empty
.yiz-table-empty-cell {
  text-align: center;
}

.yiz-table-empty {
  text-align: center;
  padding: 48px 0;
  color: #999;
}

// fixed columns
.yiz-table-th.yiz-table-fixed {
  z-index: 3;
}

.yiz-table-td.yiz-table-fixed {
  z-index: 2;
}

.yiz-table-body-table tbody tr:hover .yiz-table-td.yiz-table-fixed {
  background: #f5f7fa;
}

.yiz-table-stripe .yiz-table-body-table tbody .yiz-table-row-stripe .yiz-table-td.yiz-table-fixed {
  background: #fafafa;
}

.yiz-table-stripe .yiz-table-body-table tbody .yiz-table-row-stripe:hover .yiz-table-td.yiz-table-fixed {
  background: #f0f2f5;
}

// resize
.yiz-table-resizable .yiz-table-th,
.yiz-table-resizable .yiz-table-td {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-resizable .yiz-table-th:last-child,
.yiz-table-resizable .yiz-table-td:last-child {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-resize-handle {
  position: absolute;
  right: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  z-index: 1;
}

.yiz-table-resizing {
  border-right: 2px solid var(--yiz-color-primary) !important;
}

// resize tooltip
.yiz-table-resize-tooltip {
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

// right-fixed boundary: remove right border from last non-fixed column
.yiz-table-th.yiz-table-last-non-fixed,
.yiz-table-td.yiz-table-last-non-fixed,
.yiz-table-bordered .yiz-table-th.yiz-table-last-non-fixed,
.yiz-table-bordered .yiz-table-td.yiz-table-last-non-fixed,
.yiz-table-resizable .yiz-table-th.yiz-table-last-non-fixed,
.yiz-table-resizable .yiz-table-td.yiz-table-last-non-fixed {
  border-right: none;
}

// right-fixed boundary: add left border to first right-fixed column
.yiz-table-th.yiz-table-first-right-fixed,
.yiz-table-td.yiz-table-first-right-fixed,
.yiz-table-bordered .yiz-table-th.yiz-table-first-right-fixed,
.yiz-table-bordered .yiz-table-td.yiz-table-first-right-fixed,
.yiz-table-resizable .yiz-table-th.yiz-table-first-right-fixed,
.yiz-table-resizable .yiz-table-td.yiz-table-first-right-fixed {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}
</style>
