<template></template>

<script lang="ts" setup>
import type { DropmenuOption } from '../dropmenu/types'

defineProps<{
  label?: string
  icon?: string | (() => any) | any
  children?: DropmenuOption[]
  type?: 'item' | 'divider'
  disabled?: boolean
  item?: DropmenuOption
}>()
</script>
