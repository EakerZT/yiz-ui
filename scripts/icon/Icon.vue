<template>
  <div class="yiz-icon" :style="vStyle">
    <component v-if="$props.icon" :is="$props.icon"/>
    <slot v-else name="icon"/>
  </div>
</template>

<script setup lang="ts">
import type {Component } from "vue";
import {computed} from "vue";
const props = withDefaults(defineProps<{
  icon: Component<unknown>,
  size?: number | string
}>(), {
  size: 14
})

const vStyle = computed(() => {
  const c: Record<string, string> = {}
  c['width'] = `${props.size}px`
  c['height'] = `${props.size}px`
  c['line-height'] = `${props.size}px`
  return c
})

defineSlots<{
  icon: any
}>()
</script>