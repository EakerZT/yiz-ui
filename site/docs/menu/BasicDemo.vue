<template>
  <y-menu v-model:select="v1" :items="opts" @select="onSelect" /><span class="demo-hint">{{
    t('demo.menu.selected', { value: v1 })
  }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const opts = computed(() => [
  { label: t('demo.common.view'), key: 'view' },
  { label: t('demo.common.edit'), key: 'edit' },
  { label: t('demo.common.delete'), key: 'delete' },
])

const v1 = ref()

function onSelect(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
