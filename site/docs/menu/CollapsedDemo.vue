<template>
  <div class="demo-menu-toolbar">
    <y-switch v-model:value="dark" />
    <span class="demo-hint">{{ dark ? 'dark' : 'light' }}</span>
    <y-switch v-model:value="collapsed" />
    <span class="demo-hint">{{ collapsed ? 'collapsed' : 'expanded' }}</span>
  </div>
  <div style="display: flex; align-items: flex-start; gap: 12px">
    <y-menu v-model:select="v7" :items="collapsedItems" :collapsed="collapsed" :dark="dark" @select="onSelect7" />
  </div>
  <span class="demo-hint">{{ $t('demo.menu.selected', { value: v7 }) }}</span>
</template>

<script lang="ts" setup>
import {
  Box20Regular,
  Food20Regular,
  Gift20Regular,
  Home20Regular,
  Info20Regular,
  Laptop20Regular,
  Mail20Regular,
  Person20Regular,
  Settings20Regular,
  Shield20Regular,
  Tag20Regular,
} from '@vicons/fluent'
import { computed, h, ref } from 'vue'
import { $t, Icon } from 'yiz-ui'

const v7 = ref()

const collapsed = ref(true)

const dark = ref(true)

const collapsedItems = computed(() => [
  { label: $t('demo.common.home'), key: 'home', icon: () => h(Icon, { icon: Home20Regular }) },
  {
    label: $t('demo.common.products'),
    key: 'products',
    icon: () => h(Icon, { icon: Box20Regular }),
    children: [
      { label: $t('demo.common.allProducts'), key: 'all-products', icon: () => h(Icon, { icon: Box20Regular }) },
      {
        label: $t('demo.common.categories'),
        key: 'categories',
        icon: () => h(Icon, { icon: Tag20Regular }),
        children: [
          { label: $t('demo.common.electronics'), key: 'electronics', icon: () => h(Icon, { icon: Laptop20Regular }) },
          { label: $t('demo.common.clothing'), key: 'clothing', icon: () => h(Icon, { icon: Gift20Regular }) },
          { label: $t('demo.common.food'), key: 'food', icon: () => h(Icon, { icon: Food20Regular }) },
        ],
      },
      { label: $t('demo.common.tags'), key: 'tags', icon: () => h(Icon, { icon: Tag20Regular }) },
    ],
  },
  {
    label: $t('demo.common.settings'),
    key: 'settings',
    icon: () => h(Icon, { icon: Settings20Regular }),
    children: [
      { label: $t('demo.common.profile'), key: 'profile', icon: () => h(Icon, { icon: Person20Regular }) },
      {
        label: $t('demo.common.systemSettings'),
        key: 'system',
        icon: () => h(Icon, { icon: Settings20Regular }),
        children: [
          {
            label: $t('demo.common.securitySettings'),
            key: 'security',
            icon: () => h(Icon, { icon: Shield20Regular }),
          },
          {
            label: $t('demo.common.notificationSettings'),
            key: 'notification',
            icon: () => h(Icon, { icon: Mail20Regular }),
          },
        ],
      },
    ],
  },
  { label: $t('demo.common.about'), key: 'about', icon: () => h(Icon, { icon: Info20Regular }) },
])

function onSelect7(_item: any) {}
</script>

<style scoped>
.demo-menu-toolbar {
  display: flex;
  align-items: center;
  margin: 12px 0 8px;
}

.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
