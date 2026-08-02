<template></template>

<script lang="ts" setup>
import type { MenuEntry, MenuItemOption } from '../menu/types'

defineProps<{
  label?: string
  icon?: string | (() => any) | any
  children?: MenuEntry[]
  item?: MenuItemOption
}>()

defineSlots<{
  default?: () => any
}>()
</script>
