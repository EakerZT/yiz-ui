<template>
  <y-dropmenu @select="onSelect2">
    <template #trigger>
      <y-button type="primary">{{ $t('demo.dropmenu.slotOpen') }}</y-button>
    </template>
    <y-dropmenu-item :label="$t('demo.common.view')" key="view" />
    <y-dropmenu-item :label="$t('demo.common.edit')" key="edit" />
    <y-dropmenu-item :label="$t('demo.common.delete')" key="delete" /> </y-dropmenu
  ><span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v2 ?? $t('demo.common.empty') }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v2 = ref()

function onSelect2(item: any) {
  v2.value = item.key
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
