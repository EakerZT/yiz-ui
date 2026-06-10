<template>
  <section class="demo-section">
    <h2 class="demo-section-title">ContextMenu 右键菜单</h2>
    <p class="demo-section-desc">弹出式菜单，支持普通项、分割线、子菜单、复选框和单选框。</p>

    <div class="demo-row">
      <span class="demo-label">综合</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-context-menu :items="allItems" @select="onSelect1">
            <template #icon="{ icon }">
              <Icon size="16" :icon="iconMap[icon]" />
            </template>
          </y-context-menu>
        </span>
        <span class="demo-item-hint">选中: {{ last1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">函数调用</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-button @click="onShowMenu">点击弹出</y-button>
        </span>
        <span class="demo-item-hint">{{ last2 }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
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
  { label: '新建', value: 'new', icon: 'new' },
  { label: '打开', value: 'open', icon: 'open' },
  { type: 'divider' as const },
  {
    label: '排列方式',
    value: 'layout',
    type: 'submenu' as const,
    children: [
      { label: '列表', value: 'list', type: 'radiogroup' as const, name: 'layout', checked: true },
      { label: '网格', value: 'grid', type: 'radiogroup' as const, name: 'layout' },
      { label: '缩略图', value: 'thumb', type: 'radiogroup' as const, name: 'layout' }
    ]
  },
  {
    label: '显示项',
    value: 'show',
    type: 'submenu' as const,
    children: [
      { label: '工具栏', value: 'toolbar', type: 'checkbox' as const, checked: true },
      { label: '状态栏', value: 'statusbar', type: 'checkbox' as const },
      {
        label: '更多面板',
        value: 'more-panels',
        type: 'submenu' as const,
        children: [
          { label: '大纲', value: 'outline', type: 'checkbox' as const },
          { label: '时间轴', value: 'timeline', type: 'checkbox' as const, checked: true },
          { label: '终端', value: 'terminal', type: 'checkbox' as const }
        ]
      }
    ]
  },
  { type: 'divider' as const },
  { label: '保存', value: 'save', icon: 'save' },
  { label: '导出', value: 'export' },
  { label: '属性', value: 'properties', disabled: true }
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
