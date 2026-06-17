<template></template>

<script lang="ts" setup>
import type { MenuItem } from '../menu/Menu.vue'

defineProps<{
  label?: string
  icon?: string | (() => any) | any
  children?: MenuItem[]
  item?: { label: string; key: any; icon?: any; children?: MenuItem[]; [key: string]: any }
}>()
</script>
