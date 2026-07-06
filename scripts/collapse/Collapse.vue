<template>
  <div class="yiz-collapse" :class="{ 'yiz-collapse-borderless': !bordered }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, toRef, type Ref } from 'vue'

export type CollapseKey = string | number
export type CollapseValue = CollapseKey | CollapseKey[]

interface CollapseContext {
  accordion: Ref<boolean>
  isActive: (key: CollapseKey) => boolean
  toggle: (key: CollapseKey) => void
}

const props = withDefaults(
  defineProps<{
    accordion?: boolean
    bordered?: boolean
  }>(),
  {
    accordion: false,
    bordered: true,
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{
  change: [value: CollapseValue | undefined]
}>()

const value = defineModel<CollapseValue | undefined>('value', { default: () => [] })

function getValueArray() {
  if (value.value == null) return []
  return Array.isArray(value.value) ? value.value : [value.value]
}

function isActive(key: CollapseKey) {
  return getValueArray().includes(key)
}

function toggle(key: CollapseKey) {
  let nextValue: CollapseValue | undefined
  if (props.accordion) {
    nextValue = isActive(key) ? undefined : key
  } else {
    const next = getValueArray()
    const index = next.indexOf(key)
    if (index >= 0) next.splice(index, 1)
    else next.push(key)
    nextValue = next
  }
  value.value = nextValue
  emit('change', nextValue)
}

provide<CollapseContext>('yizCollapse', {
  accordion: toRef(props, 'accordion'),
  isActive,
  toggle,
})
</script>

<style lang="less">
.yiz-collapse {
  border: 1px solid var(--yiz-color-border);
  border-radius: var(--yiz-base-border-radius-default);
  background: #fff;
  overflow: hidden;
}

.yiz-collapse-borderless {
  border: none;
  border-radius: 0;
}
</style>
