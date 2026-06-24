<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.dropmenu.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.dropmenu.desc') }}</p>

    <y-card :title="$t('demo.dropmenu.options')" style="margin-top: 8px">
      <y-dropmenu :options="options" @select="onSelect1">
        <template #trigger>
          <y-button>{{ $t('demo.dropmenu.open') }}</y-button>
        </template>
        <template #icon="{ icon }">
          <Icon :icon="iconMap[icon]" />
        </template>
      </y-dropmenu>
      <span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v1 ?? $t('demo.common.empty') }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-dropmenu @select="onSelect2">
        <template #trigger>
          <y-button type="primary">{{ $t('demo.dropmenu.slotOpen') }}</y-button>
        </template>
        <y-menu-option :label="$t('demo.common.view')" key="view" />
        <y-menu-option :label="$t('demo.common.edit')" key="edit" />
        <y-menu-option :label="$t('demo.common.delete')" key="delete" />
      </y-dropmenu>
      <span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v2 ?? $t('demo.common.empty') }) }}</span>
    </y-card>

    <y-card :title="$t('demo.menu.submenu')" style="margin-top: 8px">
      <y-dropmenu
        :options="nestedOptions"
        :label="$t('demo.dropmenu.openNested')"
        placement="bottom-end"
        @select="onSelect3"
      />
      <span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v3 ?? $t('demo.common.empty') }) }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t, Icon } from 'yiz-ui'
import { h, ref } from 'vue'
import { Delete16Filled, Edit16Regular, Eye16Regular, Folder20Regular, Settings20Regular } from '@vicons/fluent'

const v1 = ref()
const v2 = ref()
const v3 = ref()

const iconMap: Record<string, any> = {
  view: Eye16Regular,
  edit: Edit16Regular,
  delete: Delete16Filled,
  folder: Folder20Regular,
  settings: Settings20Regular
}

const options = [
  { label: $t('demo.common.view'), key: 'view', icon: 'view' },
  { label: $t('demo.common.edit'), key: 'edit', icon: 'edit' },
  { label: $t('demo.common.delete'), key: 'delete', icon: 'delete' }
]

const nestedOptions = [
  { label: $t('demo.common.products'), key: 'products', icon: () => h(Icon, { icon: Folder20Regular }) },
  {
    label: $t('demo.common.settings'),
    key: 'settings',
    icon: () => h(Icon, { icon: Settings20Regular }),
    children: [
      { label: $t('demo.common.profile'), key: 'profile' },
      { label: $t('demo.common.systemSettings'), key: 'system' }
    ]
  },
  { label: $t('demo.common.about'), key: 'about' }
]

function onSelect1(item: any) {
  v1.value = item.key
}

function onSelect2(item: any) {
  v2.value = item.key
}

function onSelect3(item: any) {
  v3.value = item.key
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
