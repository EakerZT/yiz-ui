<template>
  <div
    ref="tableWrapperRef"
    class="yiz-table-wrapper"
    :class="vClass"
    role="table"
    :aria-busy="loading"
    v-bind="$attrs"
  >
    <!-- Header table -->
    <div class="yiz-table-header-wrapper" ref="headerWrapperRef" role="rowgroup">
      <div
        class="yiz-table-header"
        role="row"
        :style="{ width: tableContentWidth, gridTemplateColumns: columnTemplate }"
      >
        <div
          v-for="col in renderedColumns"
          :key="col.field"
          role="columnheader"
          class="yiz-table-th"
          :class="[
            {
              'yiz-table-gap-col': col.field === '__yiz_gap',
              'yiz-table-sortable': col.sortable,
              'yiz-table-resizing': resizing === col.field,
              'yiz-table-fixed': col.fixed !== 'none',
              'yiz-table-fixed-left': col.fixed === 'left',
              'yiz-table-fixed-right': col.fixed === 'right',
              'yiz-table-last-non-fixed': borderMarkerFields.lastNonFixed === col.field,
              'yiz-table-first-right-fixed': borderMarkerFields.firstRightFixed === col.field,
              'yiz-table-last-right-fixed': borderMarkerFields.lastRightFixed === col.field,
              'yiz-table-left-fixed-shadow': borderMarkerFields.lastLeftFixed === col.field && leftFixedShadowVisible,
              'yiz-table-right-fixed-shadow':
                borderMarkerFields.firstRightFixed === col.field && rightFixedShadowVisible,
            },
            getHeaderCellClass(col),
          ]"
          :style="[{ textAlign: col.align || 'left' }, getHeaderCellStyle(col), getCellLayoutStyle(col)]"
          :tabindex="col.sortable ? 0 : undefined"
          :aria-sort="getAriaSort(col)"
          @click="col.sortable && onSort(col)"
          @keydown.enter.prevent="col.sortable && onSort(col)"
          @keydown.space.prevent="col.sortable && onSort(col)"
        >
          <label
            v-if="col.field === '__yiz_select' && selectMode === 'multi'"
            class="yiz-table-select-cell"
            @click.stop
          >
            <Checkbox v-model:checked="headerChecked" />
          </label>
          <span
            v-else
            class="yiz-table-th-label"
            :class="{ 'yiz-table-cell-ellipsis': isOverflowTooltipOn(col) }"
            @mouseenter="onHeaderEnter($event, col)"
            @mouseleave="onCellLeave"
            >{{ col.label }}</span
          >
          <span v-if="col.sortable" class="yiz-table-sort">
            <Icon
              size="16"
              class="yiz-table-sort-icon"
              :class="{
                'yiz-table-sort-icon-active': sortKey === col.field,
                'yiz-table-sort-icon-desc': sortKey === col.field && sortOrder === 'desc',
              }"
              :icon="sortKey === col.field ? ArrowSortDownLines16Regular : ArrowSort16Regular"
            />
          </span>
          <span
            v-if="resize && col.field !== '__yiz_select' && col.field !== '__yiz_row_no' && col.field !== '__yiz_gap'"
            class="yiz-table-resize-handle"
            @mousedown.stop="onResizeStart($event, col)"
            @click.stop
          />
        </div>
      </div>
    </div>

    <!-- Body table -->
    <div class="yiz-table-body-wrapper">
      <ScrollBox
        auto-hide="leave"
        ref="bodyScrollBoxRef"
        class="yiz-table-body-scrollbox"
        :class="{ 'yiz-table-body-empty': sortedData.length === 0 }"
        :z-index="4"
        @scroll="onBodyScroll"
      >
        <!-- 空状态：脱离表格，居中不滚动 -->
        <div v-if="sortedData.length === 0" class="yiz-table-empty-wrap">
          <slot name="empty">
            <Empty size="small" />
          </slot>
        </div>

        <!-- 数据表格 -->
        <div
          v-else
          class="yiz-table-body"
          ref="bodyContentRef"
          role="rowgroup"
          :class="{ 'yiz-table-body-short': bodyContentShort }"
          :style="{ width: tableContentWidth }"
        >
          <div
            v-for="(row, idx) in sortedData"
            :key="getRowKey(row, idx)"
            role="row"
            class="yiz-table-row"
            :class="[{ 'yiz-table-row-stripe': stripe && idx % 2 === 1 }, getRowClass(row, idx)]"
            :style="[getRowStyle(row, idx), { gridTemplateColumns: columnTemplate }]"
            @dblclick="onRowDblclick(row, idx, $event)"
          >
            <div
              v-for="col in renderedColumns"
              :key="col.field"
              role="cell"
              class="yiz-table-td"
              :class="[
                {
                  'yiz-table-gap-col': col.field === '__yiz_gap',
                  'yiz-table-fixed': col.fixed !== 'none',
                  'yiz-table-fixed-left': col.fixed === 'left',
                  'yiz-table-fixed-right': col.fixed === 'right',
                  'yiz-table-last-non-fixed': borderMarkerFields.lastNonFixed === col.field,
                  'yiz-table-first-right-fixed': borderMarkerFields.firstRightFixed === col.field,
                  'yiz-table-last-right-fixed': borderMarkerFields.lastRightFixed === col.field,
                  'yiz-table-left-fixed-shadow':
                    borderMarkerFields.lastLeftFixed === col.field && leftFixedShadowVisible,
                  'yiz-table-right-fixed-shadow':
                    borderMarkerFields.firstRightFixed === col.field && rightFixedShadowVisible,
                },
                getBodyCellClass(row, idx, col),
              ]"
              :style="[{ textAlign: col.align || 'left' }, getBodyCellStyle(row, idx, col), getCellLayoutStyle(col)]"
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
                <span
                  v-else
                  :class="{ 'yiz-table-cell-ellipsis': isOverflowTooltipOn(col) }"
                  @mouseenter="onCellEnter($event, col)"
                  @mouseleave="onCellLeave"
                  >{{ col.formatter ? col.formatter(row[col.field], row, idx) : row[col.field] }}</span
                >
              </template>
            </div>
          </div>
        </div>
      </ScrollBox>
    </div>

    <!-- Footer table -->
    <div v-if="footerRows.length > 0" ref="footerWrapperRef" class="yiz-table-footer-wrapper" role="rowgroup">
      <div class="yiz-table-footer" :style="{ width: tableContentWidth }">
        <div
          v-for="(footerRow, rowIndex) in footerRows"
          :key="footerRow.key"
          role="row"
          class="yiz-table-footer-row"
          :class="footerRow.className"
          :style="{ gridTemplateColumns: columnTemplate }"
        >
          <div
            v-for="col in renderedColumns"
            :key="col.field"
            role="cell"
            class="yiz-table-td yiz-table-footer-cell"
            :class="{
              'yiz-table-gap-col': col.field === '__yiz_gap',
              'yiz-table-fixed': col.fixed !== 'none',
              'yiz-table-fixed-left': col.fixed === 'left',
              'yiz-table-fixed-right': col.fixed === 'right',
              'yiz-table-last-non-fixed': borderMarkerFields.lastNonFixed === col.field,
              'yiz-table-first-right-fixed': borderMarkerFields.firstRightFixed === col.field,
              'yiz-table-last-right-fixed': borderMarkerFields.lastRightFixed === col.field,
              'yiz-table-left-fixed-shadow': borderMarkerFields.lastLeftFixed === col.field && leftFixedShadowVisible,
              'yiz-table-right-fixed-shadow':
                borderMarkerFields.firstRightFixed === col.field && rightFixedShadowVisible,
            }"
            :style="[{ textAlign: col.align || 'left' }, getCellLayoutStyle(col)]"
          >
            <slot
              name="footer-cell"
              :footer-row="footerRow"
              :row-index="rowIndex"
              :column="col"
              :value="footerRow.cells[col.field]"
            >
              <FooterCellRenderer :value="footerRow.cells[col.field]" />
            </slot>
          </div>
        </div>
      </div>
    </div>

    <Transition name="yiz-table-loading-fade">
      <div v-if="loading" class="yiz-table-loading-mask" role="status">
        <slot name="loading">
          <Loading />
        </slot>
      </div>
    </Transition>

    <div style="display: none"><slot /></div>
  </div>
  <Teleport to="body">
    <div
      v-if="resizing"
      class="yiz-table-resize-tooltip yiz-table-cell-tooltip-top"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px', zIndex: 9999 }"
    >
      <div class="yiz-table-cell-tooltip-content">{{ $t('table.width') }}:{{ tooltipWidth }}px</div>
      <div class="yiz-table-cell-tooltip-arrow" />
    </div>
  </Teleport>

  <Teleport to="body">
    <transition name="yiz-table-cell-tooltip-fade">
      <div
        v-if="tipVisible"
        ref="tooltipRef"
        class="yiz-table-cell-tooltip"
        :class="`yiz-table-cell-tooltip-${tipPlacement}`"
        :style="{ left: tipPos.left + 'px', top: tipPos.top + 'px', zIndex: tipZ }"
        @mouseenter="onTipMouseEnter"
        @mouseleave="onTipMouseLeave"
      >
        <div class="yiz-table-cell-tooltip-content">{{ tipContent }}</div>
        <div class="yiz-table-cell-tooltip-arrow" />
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  Comment,
  computed,
  defineComponent,
  Fragment,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  Text,
  useSlots,
  watch,
  type CSSProperties,
  type VNodeChild,
} from 'vue'
import { ArrowSort16Regular, ArrowSortDownLines16Regular } from '@vicons/fluent'
import TableColumnComp from './TableColumn.vue'
import CellRenderer from './CellRenderer.vue'
import Checkbox from '../checkbox/Checkbox.vue'
import Radio from '../radio/Radio.vue'
import { Icon } from '../icon'
import { ScrollBox } from '../scroll-box'
import { Empty } from '../empty'
import { Loading } from '../loading'
import { $t } from '../locale'
import { nextZIndex } from '../zIndex'

export interface TableColumn {
  label: string
  field: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  maxWidth?: number
  fixed?: 'none' | 'left' | 'right'
  renderFn?: (scope: { value: any; row: any; index: number }) => any
  formatter?: (value: any, row: any, index: number) => any
  showOverflow?: boolean
  cellClass?: TableClassSource<TableCellContext>
  cellStyle?: TableStyleSource<TableCellContext>
  headerClass?: TableClassSource<TableHeaderCellContext>
  headerStyle?: TableStyleSource<TableHeaderCellContext>
}

export type TableClassValue = string | Record<string, boolean> | TableClassValue[] | false | null | undefined

export type TableStyleValue = CSSProperties | string | TableStyleValue[] | false | null | undefined

type TablePresentationResolver<Context, Result> = {
  bivarianceHack(context: Context): Result
}['bivarianceHack']

export type TableClassSource<Context> = TableClassValue | TablePresentationResolver<Context, TableClassValue>

export type TableStyleSource<Context> = TableStyleValue | TablePresentationResolver<Context, TableStyleValue>

export interface TableRowContext<Row extends Record<string, any> = Record<string, any>> {
  row: Row
  rowIndex: number
  dataIndex: number
  rowKey: string | number
  selected: boolean
  disabled: boolean
}

export interface TableHeaderCellContext {
  column: TableColumn
  columnIndex: number
}

export interface TableCellContext<Row extends Record<string, any> = Record<string, any>> extends TableRowContext<Row> {
  value: any
  column: TableColumn
  columnIndex: number
}

export type TableFooterValue = VNodeChild

export interface TableFooterRow {
  key: string | number
  cells: Record<string, TableFooterValue>
  className?: string
}

export interface TableFooterContext {
  columns: readonly TableColumn[]
  data: readonly Record<string, any>[]
}

export type TableFooterMethod = (context: TableFooterContext) => readonly TableFooterRow[]

export interface TableFooterCellScope {
  footerRow: TableFooterRow
  rowIndex: number
  column: TableColumn
  value: TableFooterValue
}

export type TableSortOrder = 'asc' | 'desc'

export interface TableSortState {
  field: string
  order: TableSortOrder
}

const FooterCellRenderer = defineComponent({
  name: 'TableFooterCellRenderer',
  props: {
    value: {},
  },
  setup(rendererProps) {
    return () => rendererProps.value as VNodeChild
  },
})

const slots = useSlots()

const selected = defineModel<any>('selected')
const sort = defineModel<TableSortState | null>('sort', { default: null })

const props = withDefaults(
  defineProps<{
    data?: Record<string, any>[]
    bordered?: boolean
    stripe?: boolean
    size?: 'small' | 'default' | 'large'
    resize?: boolean
    no?: boolean
    selectMode?: 'none' | 'single' | 'multi'
    rowKey?: string
    selectDisabled?: (row: any, index: number) => boolean
    loading?: boolean
    showOverflow?: boolean
    showFooter?: boolean
    footerMethod?: TableFooterMethod
    sortMode?: 'local' | 'remote'
    /**
     * 数据行的动态 class。
     * @en Dynamic class for a data row.
     */
    rowClass?: TableClassSource<TableRowContext>
    /**
     * 数据行的动态内联样式。
     * @en Dynamic inline style for a data row.
     */
    rowStyle?: TableStyleSource<TableRowContext>
    /**
     * 全表数据单元格的动态 class。
     * @en Dynamic class for data cells across the table.
     */
    cellClass?: TableClassSource<TableCellContext>
    /**
     * 全表数据单元格的动态内联样式。
     * @en Dynamic inline style for data cells across the table.
     */
    cellStyle?: TableStyleSource<TableCellContext>
  }>(),
  {
    data: () => [],
    bordered: false,
    stripe: false,
    size: 'default',
    resize: false,
    no: false,
    selectMode: 'none',
    selectDisabled: undefined,
    loading: false,
    showOverflow: false,
    showFooter: false,
    footerMethod: undefined,
    sortMode: 'local',
    rowClass: undefined,
    rowStyle: undefined,
    cellClass: undefined,
    cellStyle: undefined,
  },
)

function parsePixelValue(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : undefined
  }
  if (typeof value !== 'string') return undefined

  const text = value.trim()
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:px)?$/i.test(text)) return undefined

  const numberValue = Number.parseFloat(text)
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined
}

// 规范化布尔 prop：从 vnode.props 直接读取未挂载的子组件不会触发 Vue 的 Boolean cast,
// 因此 <y-table-column show-overflow /> 会被存储为空字符串而非 true。
function normalizeBoolProp(v: unknown): boolean | undefined {
  if (v == null) return undefined
  if (typeof v === 'boolean') return v
  if (v === '' || v === 'true') return true
  if (v === 'false') return false
  return Boolean(v)
}

function normalizePixelWidth(value: unknown): string | undefined {
  const numberValue = parsePixelValue(value)
  return numberValue == null ? undefined : `${numberValue}px`
}

function isRenderableSlotContent(nodes: any[]): boolean {
  return nodes.some((node) => {
    if (node == null || typeof node === 'boolean') return false
    if (Array.isArray(node)) return isRenderableSlotContent(node)
    if (node.type === Comment) return false
    if (node.type === Text) return String(node.children ?? '').trim().length > 0
    if (node.type === Fragment) {
      return Array.isArray(node.children) ? isRenderableSlotContent(node.children) : false
    }
    return true
  })
}

function getRenderableDefaultSlot(vnode: any) {
  const vnodeSlots = vnode.children
  const defaultSlot =
    vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.default === 'function'
      ? vnodeSlots.default
      : undefined
  if (!defaultSlot) return undefined

  const nodes = defaultSlot({ value: '__yiz_table_slot_probe__', row: {}, index: 0 })
  return Array.isArray(nodes) && isRenderableSlotContent(nodes) ? defaultSlot : undefined
}

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 TableColumn 能被正确提取
function collectColumnVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectColumnVNodes(children))
      }
    } else if (vnode && vnode.type === TableColumnComp) {
      result.push(vnode)
    }
  }
  return result
}

const columns = computed(() => {
  const nodes = collectColumnVNodes(slots.default?.() ?? [])
  const cols: TableColumn[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.field) {
        const defaultSlot = getRenderableDefaultSlot(vnode)
        const minWidth = parsePixelValue(p.minWidth ?? p['min-width'])
        const maxWidth = parsePixelValue(p.maxWidth ?? p['max-width'])
        const fixed = p.fixed ?? 'none'
        cols.push({
          label: p.label ?? '',
          field: p.field,
          width: normalizePixelWidth(p.width),
          sortable: normalizeBoolProp(p.sortable) ?? false,
          align: p.align ?? 'left',
          minWidth,
          maxWidth,
          fixed: (fixed as 'none' | 'left' | 'right') || 'none',
          renderFn: defaultSlot,
          formatter: p.formatter,
          showOverflow: normalizeBoolProp(p.showOverflow ?? p['show-overflow']),
          cellClass: p.cellClass ?? p['cell-class'],
          cellStyle: p.cellStyle ?? p['cell-style'],
          headerClass: p.headerClass ?? p['header-class'],
          headerStyle: p.headerStyle ?? p['header-style'],
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

  result.push(...leftFixed, ...normal)
  // 空列：放在非固定列之后、右固定列之前，吸收剩余宽度
  result.push({ label: '', field: '__yiz_gap', width: undefined, fixed: 'none' })
  result.push(...rightFixed)
  return result
})

const renderedColumns = computed(() => {
  return displayColumns.value.filter((col) => col.field !== '__yiz_gap' || showGapColumn.value)
})

const columnTemplate = computed(() => {
  return renderedColumns.value.map((col) => (col.field === '__yiz_gap' ? 'minmax(0, 1fr)' : colWidth(col))).join(' ')
})

const tableContentWidth = computed(() => {
  const wrapperWidth = tableWrapperRef.value?.clientWidth ?? 0
  const totalWidth = renderedColumns.value.reduce((sum, col) => {
    const width = columnWidths.value[col.field] || col.width
    return sum + (width ? parseFloat(width) || 0 : 0)
  }, 0)
  return totalWidth > wrapperWidth ? `${totalWidth}px` : '100%'
})

const borderMarkerFields = computed(() => {
  const cols = renderedColumns.value
  let lastLeftFixed: string | null = null
  let lastNonFixed: string | null = null
  let firstRightFixed: string | null = null
  let lastRightFixed: string | null = null
  for (let i = 0; i < cols.length; i++) {
    if (cols[i].fixed === 'left') {
      lastLeftFixed = cols[i].field
    }
  }
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
  for (let i = cols.length - 1; i >= 0; i--) {
    if (cols[i].fixed === 'right') {
      lastRightFixed = cols[i].field
      break
    }
  }
  return { lastLeftFixed, lastNonFixed, firstRightFixed, lastRightFixed }
})

const fixedOffsets = computed(() => {
  const offsets: Record<string, { left?: string; right?: string }> = {}
  const cols = renderedColumns.value
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

function getCellLayoutStyle(col: TableColumn): Record<string, string> {
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
  if (props.rowKey) return row[props.rowKey]
  const dataIndex = props.data.indexOf(row)
  return dataIndex >= 0 ? dataIndex : index
}

function isOverflowTooltipOn(col: TableColumn) {
  if (col.renderFn) return false
  if (col.field === '__yiz_select' || col.field === '__yiz_row_no' || col.field === '__yiz_gap') return false
  return col.showOverflow ?? props.showOverflow
}

function isRowDisabled(row: Record<string, any>, index: number) {
  return props.selectDisabled ? props.selectDisabled(row, index) : false
}

function isSelected(row: Record<string, any>, index: number) {
  if (props.selectMode === 'single') return selected.value === getRowKey(row, index)
  if (props.selectMode === 'multi') return (selected.value ?? []).includes(getRowKey(row, index))
  return false
}

function getSelectedRows(selectedValue = selected.value) {
  if (props.selectMode === 'none') return null
  if (props.selectMode === 'single') {
    if (selectedValue == null) return null
    const idx = sortedData.value.findIndex((row, i) => getRowKey(row, i) === selectedValue)
    return idx >= 0 ? sortedData.value[idx] : null
  }
  const keys = (selectedValue ?? []) as any[]
  return sortedData.value.filter((row, i) => keys.includes(getRowKey(row, i)))
}

function toggleSelect(row: Record<string, any>, index: number) {
  if (isRowDisabled(row, index)) return
  const key = getRowKey(row, index)
  let nextSelected = selected.value
  if (props.selectMode === 'single') {
    nextSelected = selected.value === key ? null : key
  } else if (props.selectMode === 'multi') {
    const arr = [...(selected.value ?? [])]
    const idx = arr.indexOf(key)
    if (idx >= 0) arr.splice(idx, 1)
    else arr.push(key)
    nextSelected = arr
  }
  selected.value = nextSelected
  emit('select', getSelectedRows(nextSelected))
}

const allSelected = computed(() => {
  if (props.selectMode !== 'multi') return false
  const selectableRows = sortedData.value.filter((row, i) => !isRowDisabled(row, i))
  const keys = (selected.value ?? []) as any[]
  return selectableRows.length > 0 && selectableRows.every((row, i) => keys.includes(getRowKey(row, i)))
})

const headerChecked = computed({
  get: () => allSelected.value,
  set: (v: boolean) => {
    if (props.selectMode !== 'multi') return
    let nextSelected: any[] = []
    if (v) {
      const keys: any[] = []
      sortedData.value.forEach((row, i) => {
        if (!isRowDisabled(row, i)) keys.push(getRowKey(row, i))
      })
      nextSelected = keys
    }
    selected.value = nextSelected
    emit('select', getSelectedRows(nextSelected))
  },
})

function registerColumn(col: TableColumn) {
  // kept for dynamic registration if needed
}

provide('yizTableRegisterColumn', registerColumn)

const emit = defineEmits<{
  select: [selected: Record<string, any> | Record<string, any>[] | null]
  'row-dblclick': [row: Record<string, any>, index: number, event: MouseEvent]
  'sort-change': [sort: TableSortState | null]
}>()

function onRowDblclick(row: Record<string, any>, index: number, event: MouseEvent) {
  emit('row-dblclick', row, index, event)
}

defineSlots<{
  default?: any
  empty?: any
  loading?: any
  'footer-cell'?: (scope: TableFooterCellScope) => any
}>()

const sortKey = computed(() => sort.value?.field ?? '')
const sortOrder = computed<TableSortOrder>(() => sort.value?.order ?? 'asc')

const sortedData = computed(() => {
  if (!sort.value || props.sortMode === 'remote') return props.data
  const sorted = [...props.data]
  const { field, order } = sort.value
  sorted.sort((a, b) => {
    const va = a[field]
    const vb = b[field]
    if (va == null) return 1
    if (vb == null) return -1
    if (typeof va === 'number' && typeof vb === 'number') {
      return order === 'asc' ? va - vb : vb - va
    }
    const sa = String(va)
    const sb = String(vb)
    return order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
  })
  return sorted
})

const columnIndexByField = computed(() => {
  const indexes = new Map<string, number>()
  columns.value.forEach((column, index) => indexes.set(column.field, index))
  return indexes
})

function createRowContext(row: Record<string, any>, rowIndex: number): TableRowContext {
  const dataIndex = props.data.indexOf(row)
  return {
    row,
    rowIndex,
    dataIndex: dataIndex >= 0 ? dataIndex : rowIndex,
    rowKey: getRowKey(row, rowIndex) as string | number,
    selected: isSelected(row, rowIndex),
    disabled: isRowDisabled(row, rowIndex),
  }
}

const rowContexts = computed(() => sortedData.value.map((row, rowIndex) => createRowContext(row, rowIndex)))

function getRowContext(row: Record<string, any>, rowIndex: number): TableRowContext {
  const context = rowContexts.value[rowIndex]
  return context?.row === row ? context : createRowContext(row, rowIndex)
}

function resolvePresentation<Result, Context>(
  source: Result | ((context: Context) => Result) | undefined,
  context: Context,
): Result | undefined {
  return typeof source === 'function' ? (source as (context: Context) => Result)(context) : source
}

function getRowClass(row: Record<string, any>, rowIndex: number): TableClassValue {
  if (props.rowClass == null) return undefined
  return resolvePresentation(props.rowClass, getRowContext(row, rowIndex))
}

function getRowStyle(row: Record<string, any>, rowIndex: number): TableStyleValue {
  if (props.rowStyle == null) return undefined
  return resolvePresentation(props.rowStyle, getRowContext(row, rowIndex))
}

function getHeaderCellContext(column: TableColumn): TableHeaderCellContext | undefined {
  const columnIndex = columnIndexByField.value.get(column.field)
  if (columnIndex == null) return undefined
  return { column, columnIndex }
}

function getHeaderCellClass(column: TableColumn): TableClassValue {
  if (column.headerClass == null) return undefined
  const context = getHeaderCellContext(column)
  return context ? resolvePresentation(column.headerClass, context) : undefined
}

function getHeaderCellStyle(column: TableColumn): TableStyleValue {
  if (column.headerStyle == null) return undefined
  const context = getHeaderCellContext(column)
  return context ? resolvePresentation(column.headerStyle, context) : undefined
}

function getBodyCellContext(
  row: Record<string, any>,
  rowIndex: number,
  column: TableColumn,
): TableCellContext | undefined {
  const columnIndex = columnIndexByField.value.get(column.field)
  if (columnIndex == null) return undefined
  return {
    ...getRowContext(row, rowIndex),
    value: row[column.field],
    column,
    columnIndex,
  }
}

function getBodyCellClass(row: Record<string, any>, rowIndex: number, column: TableColumn): TableClassValue {
  if (column.cellClass == null && props.cellClass == null) return undefined
  const context = getBodyCellContext(row, rowIndex, column)
  if (!context) return undefined
  return [resolvePresentation(column.cellClass, context), resolvePresentation(props.cellClass, context)]
}

function getBodyCellStyle(row: Record<string, any>, rowIndex: number, column: TableColumn): TableStyleValue {
  if (column.cellStyle == null && props.cellStyle == null) return undefined
  const context = getBodyCellContext(row, rowIndex, column)
  if (!context) return undefined
  return [resolvePresentation(column.cellStyle, context), resolvePresentation(props.cellStyle, context)]
}

const footerColumns = computed(() =>
  displayColumns.value.filter(
    (column) => column.field !== '__yiz_select' && column.field !== '__yiz_row_no' && column.field !== '__yiz_gap',
  ),
)

const footerRows = computed<readonly TableFooterRow[]>(() => {
  if (!props.showFooter || !props.footerMethod) return []
  const rows = props.footerMethod({
    columns: footerColumns.value,
    data: sortedData.value,
  })
  return Array.isArray(rows) ? rows : []
})

function onSort(col: TableColumn) {
  let nextSort: TableSortState | null
  if (sort.value?.field !== col.field) {
    nextSort = { field: col.field, order: 'asc' }
  } else if (sort.value.order === 'asc') {
    nextSort = { field: col.field, order: 'desc' }
  } else {
    nextSort = null
  }
  sort.value = nextSort
  emit('sort-change', nextSort)
}

function getAriaSort(col: TableColumn): 'ascending' | 'descending' | 'none' | undefined {
  if (!col.sortable) return undefined
  if (sort.value?.field !== col.field) return 'none'
  return sort.value.order === 'asc' ? 'ascending' : 'descending'
}

const vClass = computed(() => ({
  'yiz-table-bordered': props.bordered,
  'yiz-table-stripe': props.stripe,
  [`yiz-table-${props.size}`]: props.size !== 'default',
  'yiz-table-resizable': props.resize,
}))

const tableWrapperRef = ref<HTMLDivElement>()
const headerWrapperRef = ref<HTMLDivElement>()
const footerWrapperRef = ref<HTMLDivElement>()
const bodyScrollBoxRef = ref<InstanceType<typeof ScrollBox>>()
const bodyContentRef = ref<HTMLDivElement>()
const columnWidths = ref<Record<string, string>>({})
const showGapColumn = ref(false)

const widthsInitialized = ref(false)

function computeWidths() {
  const wrapper = tableWrapperRef.value
  if (!wrapper) return
  const tableWidth = wrapper.clientWidth
  const cols = displayColumns.value
  if (cols.length === 0) return

  const widths: Record<string, string> = {}
  const prev = columnWidths.value

  // 所有列（除空列）：优先保留已调整过的宽度，否则用初始值
  for (const col of cols) {
    if (col.field === '__yiz_gap') continue
    const w = prev[col.field] || col.width
    if (w) {
      widths[col.field] = w
    }
  }

  // 初始化：未指定宽度的列均分剩余空间
  if (!widthsInitialized.value) {
    widthsInitialized.value = true
    const colsWithWidth: typeof cols = []
    const colsWithoutWidth: typeof cols = []
    for (const col of cols) {
      if (col.field === '__yiz_gap') continue
      if (widths[col.field]) {
        colsWithWidth.push(col)
      } else {
        colsWithoutWidth.push(col)
      }
    }
    if (colsWithoutWidth.length > 0) {
      const fixedTotal = colsWithWidth.reduce((sum, c) => sum + parseFloat(widths[c.field]), 0)
      const remaining = tableWidth - fixedTotal
      const each = remaining / colsWithoutWidth.length
      for (const col of colsWithoutWidth) {
        const minWidth = col.minWidth ?? 100
        widths[col.field] = `${Math.max(each, minWidth)}px`
      }
    }
  }

  columnWidths.value = widths

  // 总列宽不足时启用空列吸收剩余宽度，否则隐藏
  const totalW = Object.values(widths).reduce((sum, w) => sum + parseFloat(w), 0)
  showGapColumn.value = totalW < tableWidth
  nextTick(() => {
    checkBodyContentShort()
    checkFixedColumnShadow()
  })
}

const bodyContentShort = ref(false)
const leftFixedShadowVisible = ref(false)
const rightFixedShadowVisible = ref(false)

function checkBodyContentShort() {
  const vp = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  const body = bodyContentRef.value
  if (!vp || !body) {
    bodyContentShort.value = false
    return
  }

  bodyContentShort.value = body.getBoundingClientRect().height < vp.clientHeight - 1
}

function checkFixedColumnShadow() {
  const vp = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  if (!vp) {
    leftFixedShadowVisible.value = false
    rightFixedShadowVisible.value = false
    return
  }

  const maxScrollLeft = vp.scrollWidth - vp.clientWidth
  const hasHorizontalOverflow = maxScrollLeft > 1
  leftFixedShadowVisible.value = hasHorizontalOverflow && vp.scrollLeft > 1
  rightFixedShadowVisible.value = hasHorizontalOverflow && vp.scrollLeft < maxScrollLeft - 1
}

function onBodyScroll() {
  const bodyViewport = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  if (bodyViewport) {
    if (headerWrapperRef.value) headerWrapperRef.value.scrollLeft = bodyViewport.scrollLeft
    if (footerWrapperRef.value) footerWrapperRef.value.scrollLeft = bodyViewport.scrollLeft
  }
  checkBodyContentShort()
  checkFixedColumnShadow()
  if (tipVisible.value) repositionTip()
}

let wrapperResizeObserver: ResizeObserver | null = null
let bodyContentResizeObserver: ResizeObserver | null = null
let bodyContentShortRafId: number | null = null

function scheduleBodyContentShortCheck() {
  if (bodyContentShortRafId !== null) return
  bodyContentShortRafId = requestAnimationFrame(() => {
    bodyContentShortRafId = null
    checkBodyContentShort()
  })
}

function observeBodyContentTargets() {
  bodyContentResizeObserver?.disconnect()

  const vp = bodyScrollBoxRef.value?.viewport as HTMLElement | undefined
  const body = bodyContentRef.value
  if (!vp && !body) {
    bodyContentResizeObserver = null
    bodyContentShort.value = false
    return
  }

  bodyContentResizeObserver = new ResizeObserver(() => {
    scheduleBodyContentShortCheck()
  })
  if (vp) bodyContentResizeObserver.observe(vp)
  if (body) bodyContentResizeObserver.observe(body)
  scheduleBodyContentShortCheck()
}

onMounted(() => {
  nextTick(() => {
    computeWidths()
    observeBodyContentTargets()
    onBodyScroll()
    // 监听 wrapper 尺寸变化，重新计算列宽（窗口缩放、父级布局变化等）
    if (tableWrapperRef.value) {
      wrapperResizeObserver = new ResizeObserver(() => computeWidths())
      wrapperResizeObserver.observe(tableWrapperRef.value)
    }
  })
  window.addEventListener('scroll', onWindowScrollTip, true)
  window.addEventListener('resize', onWindowResizeTip)
})

watch(
  bodyContentRef,
  () => {
    nextTick(() => observeBodyContentTargets())
  },
  { flush: 'post' },
)

watch(
  footerWrapperRef,
  () => {
    nextTick(() => onBodyScroll())
  },
  { flush: 'post' },
)

const resizing = ref<string | null>(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipWidth = ref(0)
const resizeStartRightX = ref(0)

function onResizeStart(e: MouseEvent, col: TableColumn) {
  const th = (e.target as HTMLElement).closest('.yiz-table-th') as HTMLElement
  if (!th) return

  const allThs = th.parentElement?.querySelectorAll('.yiz-table-th')
  const widths: Record<string, string> = { ...columnWidths.value }
  const cols = displayColumns.value
  if (allThs) {
    allThs.forEach((thEl, i) => {
      if (i < cols.length && cols[i].fixed === 'none' && cols[i].field !== '__yiz_gap') {
        widths[cols[i].field] = `${(thEl as HTMLElement).offsetWidth}px`
      }
    })
  }
  columnWidths.value = widths

  resizing.value = col.field
  resizeStartX.value = e.clientX
  resizeStartWidth.value = th.offsetWidth
  tooltipWidth.value = th.offsetWidth
  const thRect = th.getBoundingClientRect()
  resizeStartRightX.value = thRect.right
  // 浮在拖动线上方：left = 拖动线 x（th 右边缘）；top = th 顶部（通过 translateY(-100%) 让 tooltip 底边对齐 top）
  tooltipX.value = thRect.right
  tooltipY.value = thRect.top
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
  // tooltip 浮在拖动线上方（y 固定为 th 顶部，x 跟随拖动线移动）
  tooltipX.value = resizeStartRightX.value + delta
}

function onResizeEnd() {
  resizing.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  // 拖拽结束后重新判断是否需要空列
  const wrapper = tableWrapperRef.value
  if (wrapper) {
    const totalW = Object.values(columnWidths.value).reduce((sum, w) => sum + parseFloat(w), 0)
    showGapColumn.value = totalW < wrapper.clientWidth
    nextTick(() => {
      checkBodyContentShort()
      checkFixedColumnShadow()
    })
  }
}

// 单元格溢出 tooltip：单例共享浮层，Teleport 到 body
const tooltipRef = ref<HTMLDivElement>()
const tipVisible = ref(false)
const tipContent = ref('')
const tipPlacement = ref<'top' | 'bottom'>('top')
const tipPos = ref({ left: 0, top: 0 })
const tipZ = ref(2000)
let activeCell: HTMLElement | null = null
let tipHideTimer: ReturnType<typeof setTimeout> | null = null

function clearTipHideTimer() {
  if (tipHideTimer !== null) {
    clearTimeout(tipHideTimer)
    tipHideTimer = null
  }
}

function repositionTip() {
  const el = activeCell
  const pop = tooltipRef.value
  if (!el || !pop) return
  const tr = el.getBoundingClientRect()
  const pr = pop.getBoundingClientRect()
  const gap = 0
  const margin = 8
  const vw = window.innerWidth
  const vh = window.innerHeight

  // 行滚动出视口则隐藏
  if (tr.bottom < 0 || tr.top > vh) {
    tipVisible.value = false
    activeCell = null
    return
  }

  let placement: 'top' | 'bottom' = 'top'
  if (tr.top - pr.height - gap < margin) placement = 'bottom'
  else if (tr.bottom + pr.height + gap > vh - margin) placement = 'top'

  let left = tr.left + tr.width / 2 - pr.width / 2
  let top = placement === 'top' ? tr.top - pr.height - gap : tr.bottom + gap
  left = Math.max(margin, Math.min(left, vw - pr.width - margin))
  top = Math.max(margin, Math.min(top, vh - pr.height - margin))

  tipPos.value = { left, top }
  tipPlacement.value = placement
}

function showTip(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  if (el.scrollWidth <= el.clientWidth + 1) return // 未溢出
  const text = el.textContent == null ? '' : el.textContent.trim()
  if (!text) return
  clearTipHideTimer()
  tipZ.value = nextZIndex()
  activeCell = el
  tipContent.value = text
  tipVisible.value = true
  nextTick(repositionTip)
}

function onCellEnter(e: MouseEvent, col: TableColumn) {
  if (!isOverflowTooltipOn(col)) return
  showTip(e)
}

function onHeaderEnter(e: MouseEvent, col: TableColumn) {
  if (!isOverflowTooltipOn(col)) return
  showTip(e)
}

function onCellLeave() {
  clearTipHideTimer()
  tipHideTimer = setTimeout(() => {
    tipVisible.value = false
    activeCell = null
  }, 100)
}

function onTipMouseEnter() {
  clearTipHideTimer()
}

function onTipMouseLeave() {
  clearTipHideTimer()
  tipHideTimer = setTimeout(() => {
    tipVisible.value = false
    activeCell = null
  }, 100)
}

function onWindowScrollTip() {
  if (tipVisible.value) repositionTip()
}

function onWindowResizeTip() {
  if (tipVisible.value) repositionTip()
}

onUnmounted(() => {
  wrapperResizeObserver?.disconnect()
  bodyContentResizeObserver?.disconnect()
  if (bodyContentShortRafId !== null) {
    cancelAnimationFrame(bodyContentShortRafId)
    bodyContentShortRafId = null
  }
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  clearTipHideTimer()
  window.removeEventListener('scroll', onWindowScrollTip, true)
  window.removeEventListener('resize', onWindowResizeTip)
})
</script>

<style lang="less">
.yiz-table-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: var(--yiz-font-size-default);
  color: var(--yiz-color-text-primary);
  line-height: var(--yiz-line-height-default);
}

.yiz-table-header-wrapper {
  flex-shrink: 0;
  overflow: hidden;
}

.yiz-table-footer-wrapper {
  flex-shrink: 0;
  overflow: hidden;
}

.yiz-table-body-scrollbox {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.yiz-table-body-wrapper {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.yiz-table-bordered .yiz-table-body-scrollbox {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-header,
.yiz-table-row,
.yiz-table-footer-row {
  display: grid;
  box-sizing: border-box;
}

.yiz-table-row {
  background: var(--yiz-color-bg-container);
}

.yiz-table-body {
  box-sizing: border-box;
}

// th / td base
.yiz-table-th {
  position: relative;
  box-sizing: border-box;
  background: var(--yiz-color-bg-subtle);
  font-weight: 600;
  padding: var(--yiz-space-3) var(--yiz-space-4);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  white-space: nowrap;
  user-select: none;
  min-width: 0;
}

.yiz-table-td {
  box-sizing: border-box;
  padding: var(--yiz-space-3) var(--yiz-space-4);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  background: inherit;
  word-break: break-all;
  min-width: 0;
}

.yiz-table-footer-cell {
  background: var(--yiz-color-bg-subtle);
  font-weight: 600;
}

.yiz-table-row:hover {
  background: var(--yiz-color-bg-row-hover);
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

.yiz-table-bordered .yiz-table-body .yiz-table-row:last-child .yiz-table-td {
  border-bottom: none;
}

/* 内容短于可视区域时，最后一行恢复下边框；贴底或溢出时避免和容器底边重叠 */
.yiz-table-bordered .yiz-table-body.yiz-table-body-short .yiz-table-row:last-child .yiz-table-td {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-table-bordered .yiz-table-body.yiz-table-body-short .yiz-table-row:last-child .yiz-table-gap-col {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9) !important;
}

// stripe
.yiz-table-stripe .yiz-table-body .yiz-table-row-stripe {
  background: var(--yiz-color-bg-subtle);
}

.yiz-table-stripe .yiz-table-body .yiz-table-row-stripe:hover {
  background: var(--yiz-color-bg-active);
}

// size
.yiz-table-small {
  .yiz-table-th,
  .yiz-table-td {
    padding: 8px 12px;
    font-size: var(--yiz-font-size-small);
  }
}

.yiz-table-large {
  .yiz-table-th,
  .yiz-table-td {
    padding: var(--yiz-space-4) var(--yiz-space-5);
    font-size: var(--yiz-font-size-large);
  }
}

// sort
.yiz-table-sortable {
  cursor: pointer;

  &:hover {
    background: var(--yiz-color-bg-active);
  }
}

.yiz-table-sort {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-left: 4px;
  color: var(--yiz-color-text-disabled);
}

.yiz-table-sort-icon {
  transform: rotate(-180deg);
  transition:
    color 0.2s,
    transform 0.2s;
}

.yiz-table-sort-icon-active {
  color: var(--yiz-color-primary);
  transform: rotate(0deg);
}

.yiz-table-sort-icon-desc {
  transform: rotate(180deg);
}

// select
.yiz-table-select-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

// empty
.yiz-table-empty-wrap {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yiz-table-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
}

.yiz-table-loading-fade-enter-active,
.yiz-table-loading-fade-leave-active {
  transition: opacity 0.2s;
}

.yiz-table-loading-fade-enter-from,
.yiz-table-loading-fade-leave-to {
  opacity: 0;
}

// gap column: absorbs remaining table width
.yiz-table-gap-col {
  padding: 0 !important;
  border: none !important;
  min-width: 0;
}

.yiz-table-th.yiz-table-gap-col {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9) !important;
}

.yiz-table-footer-cell.yiz-table-gap-col {
  background: var(--yiz-color-bg-subtle);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9) !important;
}

// fixed columns
.yiz-table-th.yiz-table-fixed {
  z-index: 3;
}

.yiz-table-td.yiz-table-fixed {
  z-index: 2;
}

.yiz-table-left-fixed-shadow::after,
.yiz-table-right-fixed-shadow::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: -1px;
  width: 12px;
  pointer-events: none;
}

.yiz-table-left-fixed-shadow::after {
  right: -12px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0));
}

.yiz-table-right-fixed-shadow::before {
  left: -12px;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0));
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

// resize tooltip：固定在拖动线上方，箭头指向 th 顶部
.yiz-table-resize-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  pointer-events: none;
  white-space: nowrap;
  font-size: 13px;
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

// right-fixed boundary: remove right border from last right-fixed column
.yiz-table-th.yiz-table-last-right-fixed,
.yiz-table-td.yiz-table-last-right-fixed,
.yiz-table-bordered .yiz-table-th.yiz-table-last-right-fixed,
.yiz-table-bordered .yiz-table-td.yiz-table-last-right-fixed,
.yiz-table-resizable .yiz-table-th.yiz-table-last-right-fixed,
.yiz-table-resizable .yiz-table-td.yiz-table-last-right-fixed {
  border-right: none;
}

// cell overflow ellipsis
.yiz-table-cell-ellipsis {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// cell overflow tooltip
.yiz-table-cell-tooltip {
  position: fixed;
  white-space: nowrap;
  font-size: 13px;
}

.yiz-table-cell-tooltip-content {
  background: #303133;
  color: var(--yiz-color-text-inverse);
  border-radius: var(--yiz-pane-border-radius);
  padding: 6px 12px;
  line-height: 1.4;
  box-shadow: var(--yiz-shadow-small);
}

.yiz-table-cell-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

.yiz-table-cell-tooltip-top {
  padding-bottom: 8px;

  .yiz-table-cell-tooltip-arrow {
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: #303133;
  }
}

.yiz-table-cell-tooltip-bottom {
  padding-top: 8px;

  .yiz-table-cell-tooltip-arrow {
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: #303133;
  }
}

.yiz-table-cell-tooltip-fade-enter-active,
.yiz-table-cell-tooltip-fade-leave-active {
  transition: opacity 0.2s;
}

.yiz-table-cell-tooltip-fade-enter-from,
.yiz-table-cell-tooltip-fade-leave-to {
  opacity: 0;
}
</style>
