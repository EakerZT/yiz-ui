<template>
  <div class="yiz-divider" :class="vClass" role="separator">
    <span v-if="direction === 'horizontal' && hasContent" class="yiz-divider-content">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    dashed?: boolean
    textPlacement?: 'left' | 'center' | 'right'
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    textPlacement: 'center'
  }
)

defineSlots<{
  default?: () => any
}>()

const slots = useSlots()

const direction = computed(() => props.direction)
const hasContent = computed(() => !!slots.default?.().length)
const vClass = computed(() => ({
  [`yiz-divider-${props.direction}`]: true,
  [`yiz-divider-text-${props.textPlacement}`]: props.direction === 'horizontal' && hasContent.value,
  'yiz-divider-dashed': props.dashed,
  'yiz-divider-with-text': props.direction === 'horizontal' && hasContent.value
}))
</script>

<style lang="less">
.yiz-divider {
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.88);
  border-color: var(--yiz-color-border, #d9d9d9);
}

.yiz-divider-horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 100%;
  margin: 16px 0;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-divider-vertical {
  display: inline-block;
  height: 1em;
  margin: 0 8px;
  vertical-align: middle;
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-divider-dashed {
  border-style: dashed;
}

.yiz-divider-with-text {
  border-top: 0;

  &::before,
  &::after {
    content: '';
    position: relative;
    top: 50%;
    border-top: 1px solid var(--yiz-color-border, #d9d9d9);
    transform: translateY(50%);
  }

  &::before {
    width: 50%;
  }

  &::after {
    width: 50%;
  }

  &.yiz-divider-dashed::before,
  &.yiz-divider-dashed::after {
    border-top-style: dashed;
  }
}

.yiz-divider-text-left::before {
  width: 5%;
}

.yiz-divider-text-left::after {
  width: 95%;
}

.yiz-divider-text-right::before {
  width: 95%;
}

.yiz-divider-text-right::after {
  width: 5%;
}

.yiz-divider-content {
  display: inline-block;
  flex-shrink: 0;
  padding: 0 12px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
</style>
