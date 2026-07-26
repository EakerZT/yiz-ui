<template>
  <y-menu v-model:select="v3" @select="onSelect3">
    <y-menu-option :label="$t('demo.common.view')" key="view" />
    <y-menu-option :label="$t('demo.common.edit')" key="edit" />
    <y-menu-option :label="$t('demo.common.delete')" key="delete" /> </y-menu
  ><span class="demo-hint">{{ $t('demo.menu.selected', { value: v3 }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v3 = ref()

function onSelect3(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
