<template>
  <li class="yiz-timeline-item" :class="vClass" :style="vStyle">
    <div class="yiz-timeline-item-tail" />
    <div class="yiz-timeline-item-head">
      <slot name="dot">
        <span class="yiz-timeline-item-dot" />
      </slot>
    </div>
    <div class="yiz-timeline-item-content">
      <div v-if="time" class="yiz-timeline-item-time">{{ time }}</div>
      <div v-if="title || slots.title" class="yiz-timeline-item-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="slots.default" class="yiz-timeline-item-description">
        <slot />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    time?: string
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    color?: string
    hollow?: boolean
    position?: 'left' | 'right'
  }>(),
  {
    title: '',
    time: '',
    type: 'default',
    color: '',
    hollow: false,
    position: undefined,
  },
)

defineSlots<{
  default?: any
  title?: any
  dot?: any
}>()

const slots = useSlots()

const vClass = computed(() => {
  const c: Record<string, boolean> = {
    'yiz-timeline-item-hollow': props.hollow,
    'yiz-timeline-item-custom-dot': !!slots.dot,
  }
  if (!props.color) {
    c[`yiz-timeline-item-${props.type}`] = true
  }
  if (props.position) {
    c[`yiz-timeline-item-position-${props.position}`] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color) {
    s['--yiz-timeline-item-color'] = props.color
  }
  return s
})
</script>

<style lang="less">
.yiz-timeline-item {
  --yiz-timeline-item-color: var(--yiz-color-border, #d9d9d9);

  position: relative;
  box-sizing: border-box;
  min-height: 64px;
  padding-left: var(--yiz-timeline-content-gap);
  padding-bottom: 16px;
}

.yiz-timeline-item:last-child {
  padding-bottom: 0;

  .yiz-timeline-item-tail {
    display: none;
  }
}

.yiz-timeline-item-tail {
  position: absolute;
  top: 18px;
  bottom: var(--yiz-timeline-item-gap);
  left: var(--yiz-timeline-line-offset);
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-timeline-item-head {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--yiz-timeline-dot-size);
  height: var(--yiz-timeline-dot-size);
}

.yiz-timeline-item-dot {
  display: block;
  box-sizing: border-box;
  width: var(--yiz-timeline-dot-size);
  height: var(--yiz-timeline-dot-size);
  border: 2px solid var(--yiz-timeline-item-color);
  border-radius: 50%;
  background: var(--yiz-timeline-item-color);
}

.yiz-timeline-item-content {
  min-width: 0;
}

.yiz-timeline-item-time {
  margin-bottom: 4px;
  color: #999;
  font-size: 12px;
  line-height: 18px;
}

.yiz-timeline-item-title {
  color: #333;
  font-size: var(--yiz-timeline-font-size);
  font-weight: 500;
  line-height: 22px;
}

.yiz-timeline-item-description {
  margin-top: 4px;
  color: #666;
  font-size: 13px;
  line-height: 20px;
}

.yiz-timeline-item-default {
  --yiz-timeline-item-color: var(--yiz-color-border, #d9d9d9);
}

.yiz-timeline-item-primary {
  --yiz-timeline-item-color: var(--yiz-color-primary);
}

.yiz-timeline-item-success {
  --yiz-timeline-item-color: var(--yiz-color-success);
}

.yiz-timeline-item-warning {
  --yiz-timeline-item-color: var(--yiz-color-warning);
}

.yiz-timeline-item-error {
  --yiz-timeline-item-color: var(--yiz-color-error);
}

.yiz-timeline-item-hollow .yiz-timeline-item-dot {
  background: #fff;
}

.yiz-timeline-item-custom-dot {
  .yiz-timeline-item-head {
    top: 0;
    width: 18px;
    height: 18px;
  }
}
</style>
