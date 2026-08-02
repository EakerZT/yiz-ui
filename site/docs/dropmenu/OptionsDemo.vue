<template>
  <y-dropmenu :options="options" @select="onSelect1">
    <template #trigger>
      <y-button>{{ $t('demo.dropmenu.open') }}</y-button>
    </template>
    <template #icon="{ icon }">
      <y-icon :icon="iconMap[icon]" />
    </template> </y-dropmenu
  ><span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v1 ?? $t('demo.common.empty') }) }}</span>
</template>

<script lang="ts" setup>
import { Delete16Filled, Edit16Regular, Eye16Regular, Folder20Regular, Settings20Regular } from '@vicons/fluent'
import { computed, ref } from 'vue'
import { $t, type DropmenuOption } from 'yiz-ui'

const v1 = ref()

const iconMap: Record<string, any> = {
  view: Eye16Regular,
  edit: Edit16Regular,
  delete: Delete16Filled,
  folder: Folder20Regular,
  settings: Settings20Regular,
}

const options = computed<DropmenuOption[]>(() => [
  { label: $t('demo.common.view'), key: 'view', icon: 'view' },
  { label: $t('demo.common.edit'), key: 'edit', icon: 'edit' },
  { type: 'divider' },
  { label: $t('demo.common.delete'), key: 'delete', icon: 'delete' },
])

function onSelect1(item: any) {
  v1.value = item.key
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
