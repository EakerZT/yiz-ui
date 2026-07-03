<template></template>

<script lang="ts" setup>
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
  }>(),
  {
    label: '',
    align: 'left',
    sortable: false,
    minWidth: 40,
    fixed: 'none',
    showOverflow: undefined,
  },
)
</script>
