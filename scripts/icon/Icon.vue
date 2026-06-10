<template>
  <div class="yiz-icon" :style="vStyle">
    <component v-if="$props.icon" :is="$props.icon" />
    <slot v-else name="icon" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  icon: Component<unknown>
  size?: number | string
}>()

const vStyle = computed(() => {
  const c: Record<string, string> = {}
  c['width'] = `1em`
  c['height'] = `1em`
  c['line-height'] = `1em`
  if (props.size) {
    c['font-size'] = `${props.size}px`
  }
  return c
})

defineSlots<{
  icon: any
}>()
</script>

<style lang="less">
.yiz-icon {
  display: inline-block;
}
</style>
