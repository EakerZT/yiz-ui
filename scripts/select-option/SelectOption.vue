<template></template>

<script lang="ts" setup>
import type { VNodeChild } from 'vue'

defineProps<{
  label?: VNodeChild | (() => VNodeChild)
  value?: any
  disabled?: boolean
  item?: { label: VNodeChild | (() => VNodeChild); value: any; disabled?: boolean; [key: string]: any }
}>()

defineSlots<{
  default?: () => VNodeChild
}>()
</script>
