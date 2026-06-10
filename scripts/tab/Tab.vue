<template>
  <div class="yiz-tab">
    <div class="yiz-tab-header">
      <div
        v-for="(pane, idx) in panes"
        :key="pane.value ?? idx"
        class="yiz-tab-header-item"
        :class="{ 'yiz-tab-header-item-active': isActive(pane), 'yiz-tab-header-item-disabled': pane.disabled }"
        @click="onTabClick(pane)"
      >
        {{ pane.label }}
      </div>
      <div class="yiz-tab-header-bar" :style="barStyle" />
    </div>
    <div class="yiz-tab-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, useSlots } from 'vue'
import TabPaneComp from './TabPane.vue'

interface PaneData {
  label: string
  value: any
  disabled: boolean
}

const emit = defineEmits<{
  select: [value: any]
}>()

const slots = useSlots()

const active = defineModel<any>('active')

const panes = computed<PaneData[]>(() => {
  const nodes = slots.default?.() ?? []
  return nodes
    .map((vnode, idx) => {
      if (vnode.type === TabPaneComp && vnode.props) {
        const p = vnode.props as Record<string, any>
        return {
          label: p.label ?? `Tab ${idx + 1}`,
          value: p.value ?? idx,
          disabled: p.disabled ?? false
        }
      }
      return null
    })
    .filter((v): v is PaneData => v != null)
})

if (active.value == null) {
  active.value = panes.value[0]?.value
}

function isActive(pane: PaneData) {
  return active.value != null && pane.value === active.value
}

function onTabClick(pane: PaneData) {
  if (pane.disabled) return
  active.value = pane.value
  emit('select', pane.value)
}

const barStyle = computed(() => {
  if (panes.value.length === 0) return {}
  const idx = panes.value.findIndex((p) => p.value === active.value)
  if (idx < 0) return {}
  const pct = (idx / panes.value.length) * 100
  return {
    width: `${100 / panes.value.length}%`,
    left: `${pct}%`
  }
})

provide('yizTab', { active })
</script>

<style lang="less">
.yiz-tab {
  display: flex;
  flex-direction: column;
}

.yiz-tab-header {
  display: flex;
  position: relative;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-tab-header-item {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  padding: 0 12px;

  &:hover {
    color: var(--yiz-color-primary);
  }

  &.yiz-tab-header-item-active {
    color: var(--yiz-color-primary);
    font-weight: 500;
  }

  &.yiz-tab-header-item-disabled {
    color: #ccc;
    cursor: not-allowed;
  }
}

.yiz-tab-header-bar {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--yiz-color-primary);
  transition: left 0.3s, width 0.3s;
}

.yiz-tab-content {
  padding-top: 12px;
}
</style>
