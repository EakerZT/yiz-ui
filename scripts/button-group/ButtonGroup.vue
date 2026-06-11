<template>
  <div class="yiz-button-group" :class="vClass" :style="vStyle">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    size?: 'small' | 'default' | 'large' | number
    align?: 'start' | 'center' | 'end' | 'baseline'
    wrap?: boolean
  }>(),
  {
    direction: 'horizontal',
    size: 'default',
    align: 'center',
    wrap: false
  }
)

defineSlots<{
  default?: any
}>()

const sizeMap: Record<string, number> = {
  small: 8,
  default: 12,
  large: 20
}

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-button-group-${props.direction}`] = true
  if (props.wrap) {
    c['yiz-button-group-wrap'] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  const gap = typeof props.size === 'number' ? props.size : (sizeMap[props.size] ?? 12)
  s['--yiz-button-group-gap'] = `${gap}px`
  s['--yiz-button-group-align'] = props.align
  return s
})
</script>

<style lang="less">
.yiz-button-group {
  display: inline-flex;
  gap: var(--yiz-button-group-gap, 12px);
  align-items: var(--yiz-button-group-align, center);
}

.yiz-button-group-vertical {
  flex-direction: column;
}

.yiz-button-group-horizontal {
  flex-direction: row;
}

.yiz-button-group-wrap {
  flex-wrap: wrap;
}
</style>
