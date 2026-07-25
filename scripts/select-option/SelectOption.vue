<template></template>

<script lang="ts" setup>
import type { VNodeChild } from 'vue'

defineProps<{
  /**
   * 选项标签，也可通过默认插槽提供。
   * @en Option label. It can also be provided by the default slot.
   */
  label?: VNodeChild | (() => VNodeChild)
  /**
   * 选项值。
   * @en Option value.
   */
  value?: any
  /**
   * 是否禁用该选项。
   * @en Whether the option is disabled.
   */
  disabled?: boolean
  /**
   * 由 options 数据生成选项时使用的完整数据项。
   * @en Full data item used when options are generated from data.
   */
  item?: { label: VNodeChild | (() => VNodeChild); value: any; disabled?: boolean; [key: string]: any }
}>()

defineSlots<{
  /**
   * 自定义选项标签内容。
   * @en Custom option label content.
   */
  default?: () => VNodeChild
}>()
</script>
