<template></template>

<script lang="ts" setup>
import type { TableCellContext, TableClassSource, TableHeaderCellContext, TableStyleSource } from './Table.vue'

withDefaults(
  defineProps<{
    label?: string
    field?: string
    width?: string | number
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    minWidth?: string | number
    maxWidth?: string | number
    fixed?: 'none' | 'left' | 'right'
    formatter?: (value: any, row: any, index: number) => any
    showOverflow?: boolean
    /**
     * 当前列数据单元格的动态 class。
     * @en Dynamic class for data cells in this column.
     */
    cellClass?: TableClassSource<TableCellContext>
    /**
     * 当前列数据单元格的动态内联样式。
     * @en Dynamic inline style for data cells in this column.
     */
    cellStyle?: TableStyleSource<TableCellContext>
    /**
     * 当前列表头单元格的动态 class。
     * @en Dynamic class for this column's header cell.
     */
    headerClass?: TableClassSource<TableHeaderCellContext>
    /**
     * 当前列表头单元格的动态内联样式。
     * @en Dynamic inline style for this column's header cell.
     */
    headerStyle?: TableStyleSource<TableHeaderCellContext>
  }>(),
  {
    label: '',
    align: 'left',
    sortable: false,
    minWidth: 40,
    fixed: 'none',
    showOverflow: undefined,
    cellClass: undefined,
    cellStyle: undefined,
    headerClass: undefined,
    headerStyle: undefined,
  },
)
</script>
