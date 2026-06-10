<template></template>

<script lang="ts" setup>
import type { ContextMenuItem } from '../context-menu/ContextMenu.vue'

defineProps<{
  label?: string
  value?: any
  icon?: string | (() => any) | any
  type?: 'item' | 'divider' | 'submenu' | 'checkbox' | 'radiogroup'
  name?: string
  disabled?: boolean
  checked?: boolean
  children?: ContextMenuItem[]
  item?: { label?: string; value?: any; icon?: any; type?: string; name?: string; disabled?: boolean; checked?: boolean; children?: ContextMenuItem[]; [key: string]: any }
}>()
</script>
