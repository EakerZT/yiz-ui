<template>
  <y-button @click="onShowMenu">{{ $t('demo.contextMenu.clickToOpen') }}</y-button
  ><span class="demo-hint">{{ $t('demo.contextMenu.selected', { value: lastLabel }) }}</span>
</template>

<script lang="ts" setup>
import { Copy16Regular, Cut20Regular, Delete16Regular } from '@vicons/fluent'
import { computed, h, ref } from 'vue'
import { $t, Icon, showContextMenu } from 'yiz-ui'

const lastValue = ref<string | null>(null)

const renderIcon = (icon: any) => () => h(Icon, { size: 16, icon })

const allItems = computed(() => [
  { label: $t('demo.common.create'), value: 'new', icon: renderIcon(Cut20Regular) },
  { label: $t('demo.common.open'), value: 'open', icon: renderIcon(Copy16Regular) },
  { type: 'divider' as const },
  {
    label: $t('demo.contextMenu.layout'),
    value: 'layout',
    type: 'submenu' as const,
    children: [
      { label: $t('demo.contextMenu.list'), value: 'list', type: 'radiogroup' as const, name: 'layout', checked: true },
      { label: $t('demo.contextMenu.grid'), value: 'grid', type: 'radiogroup' as const, name: 'layout' },
      { label: $t('demo.contextMenu.thumbnail'), value: 'thumb', type: 'radiogroup' as const, name: 'layout' },
    ],
  },
  {
    label: $t('demo.contextMenu.visibleItems'),
    value: 'show',
    type: 'submenu' as const,
    children: [
      { label: $t('demo.contextMenu.toolbar'), value: 'toolbar', type: 'checkbox' as const, checked: true },
      { label: $t('demo.contextMenu.statusBar'), value: 'statusbar', type: 'checkbox' as const },
      {
        label: $t('demo.contextMenu.morePanels'),
        value: 'more-panels',
        type: 'submenu' as const,
        children: [
          { label: $t('demo.contextMenu.outline'), value: 'outline', type: 'checkbox' as const },
          { label: $t('demo.contextMenu.timeline'), value: 'timeline', type: 'checkbox' as const, checked: true },
          { label: $t('demo.contextMenu.terminal'), value: 'terminal', type: 'checkbox' as const },
        ],
      },
    ],
  },
  { type: 'divider' as const },
  { label: $t('demo.common.save'), value: 'save', icon: renderIcon(Delete16Regular) },
  { label: $t('demo.common.export'), value: 'export' },
  { label: $t('demo.contextMenu.properties'), value: 'properties', disabled: true },
])

function findItem(items: any[], value: string): any {
  for (const item of items) {
    if (item.value === value) return item
    if (item.children) {
      const child = findItem(item.children, value)
      if (child) return child
    }
  }
  return undefined
}

const lastLabel = computed(() => {
  if (lastValue.value === null) return $t('demo.common.none')
  return findItem(allItems.value, lastValue.value)?.label ?? lastValue.value
})

function onShowMenu(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  showContextMenu(rect.left, rect.bottom + 4, allItems.value, (item: any) => {
    lastValue.value = String(item.value)
  })
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
