<template>
  <y-menu v-model:select="v2" :items="navItems" @select="onSelect2" /><span class="demo-hint">{{
    t('demo.menu.selected', { value: v2 })
  }}</span>
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

const v2 = ref()

function onSelect2(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
