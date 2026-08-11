<template>
  <div style="height: 260px">
    <y-table
      :data="data"
      bordered
      stripe
      :row-class="rowClass"
      :row-style="rowStyle"
      :cell-class="cellClass"
      :cell-style="cellStyle"
    >
      <y-table-column :label="t('demo.common.name')" field="name" header-class="table-name-header" />
      <y-table-column
        :label="t('demo.table.score')"
        field="score"
        align="center"
        :cell-class="scoreCellClass"
        :cell-style="scoreCellStyle"
        :header-style="scoreHeaderStyle"
      />
      <y-table-column :label="t('demo.common.status')" field="status" align="center" :formatter="statusFormatter" />
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale, type TableCellContext, type TableHeaderCellContext, type TableRowContext } from 'yiz-ui'

const t = useLocale()

interface Row {
  name: string
  score: number
  status: 'normal' | 'attention' | 'blocked'
}

const data = computed<Row[]>(() => [
  { name: t('demo.common.personZhangsan'), score: 92, status: 'normal' },
  { name: t('demo.common.personLisi'), score: 68, status: 'attention' },
  { name: t('demo.common.personWangwu'), score: 45, status: 'blocked' },
  { name: t('demo.common.personZhaoliu'), score: 81, status: 'normal' },
])

function rowClass({ row }: TableRowContext<Row>) {
  return row.status === 'blocked' ? 'table-row-blocked' : undefined
}

function rowStyle({ row }: TableRowContext<Row>) {
  return row.status === 'attention' ? { backgroundColor: 'var(--yiz-color-warning-bg)' } : undefined
}

function cellClass({ column, row }: TableCellContext<Row>) {
  return column.field === 'status' && row.status !== 'normal' ? 'table-status-emphasis' : undefined
}

function cellStyle({ column, row }: TableCellContext<Row>) {
  if (column.field !== 'status') return undefined
  return { color: row.status === 'blocked' ? 'var(--yiz-color-error)' : undefined }
}

function scoreCellClass({ value }: TableCellContext<Row>) {
  return value < 60 ? 'table-score-low' : undefined
}

function scoreCellStyle({ value }: TableCellContext<Row>) {
  return { fontWeight: value >= 90 ? 600 : 400 }
}

function scoreHeaderStyle({ columnIndex }: TableHeaderCellContext) {
  return { color: columnIndex === 1 ? 'var(--yiz-color-primary)' : undefined }
}

function statusFormatter(value: Row['status']) {
  return t(`demo.table.status.${value}`)
}
</script>

<style lang="less" scoped>
:deep(.table-name-header) {
  color: var(--yiz-color-primary);
}

:deep(.table-row-blocked) {
  background: var(--yiz-color-error-bg);
}

:deep(.table-status-emphasis) {
  font-weight: var(--yiz-font-weight-semibold);
}

:deep(.table-score-low) {
  color: var(--yiz-color-error);
  text-decoration: underline;
}
</style>
