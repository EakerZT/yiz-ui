<template>
  <template v-if="transitionName">
    <Transition :name="transitionName">
      <div v-if="isActive" class="yiz-tab-pane">
        <slot />
      </div>
    </Transition>
  </template>
  <template v-else>
    <div v-show="isActive" class="yiz-tab-pane">
      <slot />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'

interface TabContext {
  active: Ref<any>
  transitionType: Ref<'none' | 'fade' | 'slide'>
  direction: Ref<'top' | 'bottom' | 'left' | 'right'>
}

const props = defineProps<{
  label?: string
  value?: any
  disabled?: boolean
  closable?: boolean
}>()

defineSlots<{
  default?: any
  label?: any
}>()

const tabContext = inject<TabContext | null>('yizTab', null)

const isActive = computed(() => {
  if (!tabContext) return true
  return tabContext.active.value != null && tabContext.active.value === props.value
})

const transitionName = computed(() => {
  if (!tabContext) return ''
  const type = tabContext.transitionType?.value ?? 'none'
  const dir = tabContext.direction?.value ?? 'top'
  if (type === 'none') return ''
  if (type === 'fade') return 'yiz-tab-fade'
  return `yiz-tab-slide-${dir}`
})
</script>
