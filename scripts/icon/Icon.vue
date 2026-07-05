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
    c['font-size'] = typeof props.size === 'number' ? `${props.size}px` : props.size
  }
  return c
})

defineSlots<{
  icon: any
}>()
</script>

<style lang="less">
.yiz-icon,
.yiz-render-svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: 1em;
}

.yiz-icon > svg,
.yiz-render-svg > svg {
  display: block;
  width: 1em;
  height: 1em;
}
</style>
