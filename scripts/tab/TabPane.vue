<template>
  <div v-show="isActive" class="yiz-tab-pane">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'

const props = defineProps<{
  label?: string
  value?: any
  disabled?: boolean
}>()

defineSlots<{
  default?: any
}>()

const tabContext = inject<{ active: Ref<any> }>('yizTab', null as any)

const isActive = computed(() => {
  if (!tabContext) return true
  return tabContext.active.value != null && tabContext.active.value === props.value
})
</script>
