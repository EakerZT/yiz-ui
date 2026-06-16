<template></template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
    field?: string
    width?: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    minWidth?: string | number
    maxWidth?: string | number
    fixed?: 'none' | 'left' | 'right'
    formater?: (value: any, row: any, index: number) => any
  }>(),
  {
    label: '',
    align: 'left',
    sortable: false,
    minWidth: 40,
    fixed: 'none'
  }
)
</script>
