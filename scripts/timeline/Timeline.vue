<template>
  <ol class="yiz-timeline" :class="vClass">
    <slot />
  </ol>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeSize } from '../theme'

const props = withDefaults(
  defineProps<{
    mode?: 'left' | 'right' | 'alternate'
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    mode: 'left',
  },
)

defineSlots<{
  default?: any
}>()

const resolvedSize = useThemeSize(() => props.size)

const vClass = computed(() => ({
  [`yiz-timeline-mode-${props.mode}`]: true,
  [`yiz-timeline-size-${resolvedSize.value}`]: true,
}))
</script>

<style lang="less">
.yiz-timeline {
  --yiz-timeline-dot-size: 10px;
  --yiz-timeline-line-offset: 9px;
  --yiz-timeline-item-gap: 4px;
  --yiz-timeline-content-gap: 28px;
  --yiz-timeline-font-size: var(--yiz-font-size-default);

  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--yiz-color-text-primary);
}

.yiz-timeline-size-small {
  --yiz-timeline-dot-size: 8px;
  --yiz-timeline-line-offset: 8px;
  --yiz-timeline-content-gap: 24px;
  --yiz-timeline-font-size: var(--yiz-font-size-small);
}

.yiz-timeline-size-large {
  --yiz-timeline-dot-size: 12px;
  --yiz-timeline-line-offset: 10px;
  --yiz-timeline-item-gap: 6px;
  --yiz-timeline-content-gap: 32px;
  --yiz-timeline-font-size: var(--yiz-font-size-large);
}

.yiz-timeline-mode-right {
  .yiz-timeline-item {
    padding-left: 0;
    padding-right: var(--yiz-timeline-content-gap);
    text-align: right;
  }

  .yiz-timeline-item-head {
    left: auto;
    right: 4px;
  }

  .yiz-timeline-item-tail {
    left: auto;
    right: var(--yiz-timeline-line-offset);
  }
}

.yiz-timeline-mode-alternate {
  .yiz-timeline-item {
    min-height: 72px;
    padding-left: calc(50% + 24px);
  }

  .yiz-timeline-item-head {
    left: calc(50% - (var(--yiz-timeline-dot-size) / 2));
  }

  .yiz-timeline-item-tail {
    left: 50%;
  }

  .yiz-timeline-item:nth-child(even),
  .yiz-timeline-item-position-left {
    padding-left: 0;
    padding-right: calc(50% + 24px);
    text-align: right;
  }

  .yiz-timeline-item:nth-child(odd),
  .yiz-timeline-item-position-right {
    padding-left: calc(50% + 24px);
    padding-right: 0;
    text-align: left;
  }
}
</style>
