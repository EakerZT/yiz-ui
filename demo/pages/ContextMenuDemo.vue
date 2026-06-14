<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.contextMenu.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.contextMenu.desc') }}</p>

    <y-card :title="$t('demo.contextMenu.comprehensive')" style="margin-top: 8px">
      <y-context-menu :items="allItems" @select="onSelect1">
        <template #icon="{ icon }">
          <Icon size="16" :icon="iconMap[icon]" />
        </template>
      </y-context-menu>
      <span class="demo-hint">选中: {{ last1 }}</span>
    </y-card>

    <y-card :title="$t('demo.contextMenu.fnCall')" style="margin-top: 8px">
      <y-button @click="onShowMenu">{{ $t('demo.contextMenu.clickToOpen') }}</y-button>
      <span class="demo-hint">{{ last2 }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { Cut20Filled, Copy16Filled, Delete16Filled } from '@vicons/fluent'
import { Icon, showContextMenu } from 'yiz-ui'

const last1 = ref('')
const last2 = ref('')

const iconMap: Record<string, any> = {
  new: Cut20Filled,
  open: Copy16Filled,
  save: Delete16Filled
}

const allItems = [
  { label: $t('demo.common.create'), value: 'new', icon: 'new' },
  { label: $t('demo.common.open'), value: 'open', icon: 'open' },
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
  { label: $t('demo.common.save'), value: 'save', icon: 'save' },
  { label: $t('demo.common.export'), value: 'export' },
  { label: $t('demo.contextMenu.properties'), value: 'properties', disabled: true }
]

function onSelect1(item: any) {
  last1.value = item.label
}

function onShowMenu(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  showContextMenu(rect.left, rect.bottom + 4, allItems, (item: any) => {
    last2.value = item.label
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
