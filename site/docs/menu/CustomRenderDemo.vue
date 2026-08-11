<template>
  <y-menu v-model:select="v4" :items="navItems" @select="onSelect4">
    <template #item="{ item }">
      <span style="display: flex; align-items: center; gap: 6px">
        <span style="color: var(--yiz-color-primary); font-weight: 600">·</span>
        {{ item.label }}
      </span>
    </template> </y-menu
  ><span class="demo-hint">{{ t('demo.menu.selected', { value: v4 }) }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const navItems = computed(() => [
  { label: t('demo.common.home'), key: 'home' },
  {
    label: t('demo.common.products'),
    key: 'products',
    children: [
      { label: t('demo.common.allProducts'), key: 'all-products' },
      { label: t('demo.common.categories'), key: 'categories' },
      { label: t('demo.common.tags'), key: 'tags' },
    ],
  },
  {
    label: t('demo.common.settings'),
    key: 'settings',
    children: [
      { label: t('demo.common.profile'), key: 'profile' },
      { label: t('demo.common.systemSettings'), key: 'system' },
    ],
  },
  { label: t('demo.common.about'), key: 'about' },
])

const v4 = ref()

function onSelect4(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
