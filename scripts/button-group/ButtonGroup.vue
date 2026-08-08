<template>
  <div class="yiz-button-group" :class="vClass" :style="vStyle">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * 子按钮排列方向。
     * @en Layout direction of child buttons.
     */
    direction?: 'horizontal' | 'vertical'
    /**
     * 子按钮间距，数值和数字字符串均按像素处理。
     * @en Gap between child buttons in pixels.
     */
    gap?: number | string
    /**
     * 子按钮在交叉轴上的对齐方式。
     * @en Cross-axis alignment of child buttons.
     */
    align?: 'start' | 'center' | 'end' | 'baseline'
    /**
     * 空间不足时是否换行。
     * @en Whether child buttons can wrap.
     */
    wrap?: boolean
  }>(),
  {
    direction: 'horizontal',
    gap: 12,
    align: 'center',
    wrap: false,
  },
)

defineSlots<{
  /**
   * 按钮组内容。
   * @en Content of the button group.
   */
  default?: any
}>()

const normalizedGap = computed(() => {
  const parsedGap = typeof props.gap === 'number' ? props.gap : Number(props.gap)
  return Number.isFinite(parsedGap) ? parsedGap : 12
})

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-button-group-${props.direction}`] = true
  c['yiz-button-group-gapless'] = normalizedGap.value === 0
  if (props.wrap) {
    c['yiz-button-group-wrap'] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  s['--yiz-button-group-gap'] = `${normalizedGap.value}px`
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

.yiz-button-group-gapless > .yiz-button {
  z-index: 1;

  &:hover,
  &:focus {
    z-index: 2;
  }

  &:active {
    z-index: 3;
  }
}

.yiz-button-group-horizontal.yiz-button-group-gapless {
  > .yiz-button + .yiz-button {
    margin-left: -1px;
  }

  > .yiz-button:not(:first-child),
  > .yiz-button:not(:first-child) > .yiz-wave {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .yiz-button:not(:last-child),
  > .yiz-button:not(:last-child) > .yiz-wave {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.yiz-button-group-vertical.yiz-button-group-gapless {
  > .yiz-button + .yiz-button {
    margin-top: -1px;
  }

  > .yiz-button:not(:first-child),
  > .yiz-button:not(:first-child) > .yiz-wave {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  > .yiz-button:not(:last-child),
  > .yiz-button:not(:last-child) > .yiz-wave {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
