<template></template>

<script lang="ts" setup>
import type { BreadcrumbItemData } from './Breadcrumb.vue'

defineProps<{
  href?: string
  disabled?: boolean
  item?: BreadcrumbItemData
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
