<template>
  <div
    class="yiz-progress"
    :class="`yiz-progress-status-${status}`"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="normalizedPercentage"
    :aria-valuetext="displayText"
  >
    <div class="yiz-progress-track" :style="trackStyle">
      <div class="yiz-progress-bar" :style="barStyle" />
    </div>
    <span v-if="showText" class="yiz-progress-text">
      <slot :percentage="normalizedPercentage">{{ displayText }}</slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

export type ProgressStatus = 'normal' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    percentage?: number
    status?: ProgressStatus
    color?: string
    strokeWidth?: number
    showText?: boolean
    format?: (percentage: number) => string
  }>(),
  {
    percentage: 0,
    status: 'normal',
    strokeWidth: 8,
    showText: true,
  },
)

defineSlots<{
  default?: (props: { percentage: number }) => any
}>()

const normalizedPercentage = computed(() => {
  const percentage = Number(props.percentage)
  if (!Number.isFinite(percentage)) return 0
  return Math.min(100, Math.max(0, percentage))
})

const normalizedStrokeWidth = computed(() => {
  const strokeWidth = Number(props.strokeWidth)
  if (!Number.isFinite(strokeWidth)) return 8
  return Math.max(1, strokeWidth)
})

const displayText = computed(() => {
  return props.format?.(normalizedPercentage.value) ?? `${normalizedPercentage.value}%`
})

const trackStyle = computed(() => ({
  height: `${normalizedStrokeWidth.value}px`,
}))

const barStyle = computed(() => {
  const style: Record<string, string> = {
    width: `${normalizedPercentage.value}%`,
  }
  if (props.color) style['--yiz-progress-color'] = props.color
  return style
})
</script>

<style lang="less">
.yiz-progress {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  color: var(--yiz-color-text-primary);
  font-size: 14px;
  line-height: 1;

  &.yiz-progress-status-normal {
    --yiz-progress-color: var(--yiz-color-primary);
  }

  &.yiz-progress-status-success {
    --yiz-progress-color: var(--yiz-color-success);
  }

  &.yiz-progress-status-warning {
    --yiz-progress-color: var(--yiz-color-warning);
  }

  &.yiz-progress-status-error {
    --yiz-progress-color: var(--yiz-color-error);
  }
}

.yiz-progress-track {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 999px;
  background: var(--yiz-progress-track-color, rgba(0, 0, 0, 0.08));
}

.yiz-progress-bar {
  height: 100%;
  border-radius: inherit;
  background: var(--yiz-progress-color);
  transition:
    width var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    background-color var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

.yiz-progress-text {
  min-width: 40px;
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
}
</style>
