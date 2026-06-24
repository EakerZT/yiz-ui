<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.contextMenu.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.contextMenu.desc') }}</p>

    <y-card :title="$t('demo.contextMenu.fnCall')" style="margin-top: 8px">
      <y-button @click="onShowMenu">{{ $t('demo.contextMenu.clickToOpen') }}</y-button>
      <span class="demo-hint">{{ $t('demo.contextMenu.selected', { value: last }) }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t, Icon, showContextMenu } from 'yiz-ui'
import { h, ref } from 'vue'
import { Copy16Regular, Cut20Regular, Delete16Regular } from '@vicons/fluent'

const last = ref($t('demo.common.none'))
const renderIcon = (icon: any) => () => h(Icon, { size: 16, icon })

const allItems = [
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
      { label: $t('demo.contextMenu.thumbnail'), value: 'thumb', type: 'radiogroup' as const, name: 'layout' }
    ]
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
          { label: $t('demo.contextMenu.terminal'), value: 'terminal', type: 'checkbox' as const }
        ]
      }
    ]
  },
  { type: 'divider' as const },
  { label: $t('demo.common.save'), value: 'save', icon: renderIcon(Delete16Regular) },
  { label: $t('demo.common.export'), value: 'export' },
  { label: $t('demo.contextMenu.properties'), value: 'properties', disabled: true }
]

function onShowMenu(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  showContextMenu(rect.left, rect.bottom + 4, allItems, (item: any) => {
    last.value = item.label
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
