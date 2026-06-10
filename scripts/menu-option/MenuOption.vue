<template></template>

<script lang="ts" setup>
import type { MenuItem } from '../menu/Menu.vue'

defineProps<{
  label?: string
  value?: any
  icon?: string | (() => any) | any
  children?: MenuItem[]
  item?: { label: string; value: any; icon?: any; children?: MenuItem[]; [key: string]: any }
}>()
</script>
