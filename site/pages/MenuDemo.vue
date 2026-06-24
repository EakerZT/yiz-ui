<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.menu.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.menu.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-menu v-model:select="v1" :items="opts" @select="onSelect" />
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v1 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.menu.submenu')" style="margin-top: 8px">
      <y-menu v-model:select="v2" :items="navItems" @select="onSelect2" />
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v2 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-menu v-model:select="v3" @select="onSelect3">
        <y-menu-option :label="$t('demo.common.view')" key="view" />
        <y-menu-option :label="$t('demo.common.edit')" key="edit" />
        <y-menu-option :label="$t('demo.common.delete')" key="delete" />
      </y-menu>
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v3 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.customRender')" style="margin-top: 8px">
      <y-menu v-model:select="v4" :items="navItems" @select="onSelect4">
        <template #item="{ item }">
          <span style="display: flex; align-items: center; gap: 6px">
            <span style="color: var(--yiz-color-primary); font-weight: 600">·</span>
            {{ item.label }}
          </span>
        </template>
      </y-menu>
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v4 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.menu.iconString')" style="margin-top: 8px">
      <y-menu v-model:select="v5" :items="iconItems" @select="onSelect5">
        <template #icon="{ icon }">
          <Icon :icon="iconMap[icon]" />
        </template>
      </y-menu>
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v5 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.menu.iconFn')" style="margin-top: 8px">
      <y-menu v-model:select="v6" :items="fnIconItems" @select="onSelect6" />
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v6 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.menu.collapsed')" style="margin-top: 8px">
      <div class="demo-menu-toolbar">
        <y-switch v-model:value="dark" />
        <span class="demo-hint">{{ dark ? 'dark' : 'light' }}</span>
        <y-switch v-model:value="collapsed" />
        <span class="demo-hint">{{ collapsed ? 'collapsed' : 'expanded' }}</span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 12px">
        <y-menu v-model:select="v7" :items="collapsedItems" :collapsed="collapsed" :dark="dark" @select="onSelect7">
          <template #icon="{ icon }">
            <Icon :icon="iconMap[icon]" />
          </template>
        </y-menu>
      </div>
      <span class="demo-hint">{{ $t('demo.menu.selected', { value: v7 }) }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { h, ref } from 'vue'
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
  Tag20Regular
} from '@vicons/fluent'
import { Icon } from 'yiz-ui'

const opts = [
  { label: $t('demo.common.view'), key: 'view' },
  { label: $t('demo.common.edit'), key: 'edit' },
  { label: $t('demo.common.delete'), key: 'delete' }
]

const navItems = [
  { label: $t('demo.common.home'), key: 'home' },
  {
    label: $t('demo.common.products'),
    key: 'products',
    children: [
      { label: $t('demo.common.allProducts'), key: 'all-products' },
      { label: $t('demo.common.categories'), key: 'categories' },
      { label: $t('demo.common.tags'), key: 'tags' }
    ]
  },
  {
    label: $t('demo.common.settings'),
    key: 'settings',
    children: [
      { label: $t('demo.common.profile'), key: 'profile' },
      { label: $t('demo.common.systemSettings'), key: 'system' }
    ]
  },
  { label: $t('demo.common.about'), key: 'about' }
]

const v1 = ref()
const v2 = ref()
const v3 = ref()
const v4 = ref()
const v5 = ref()
const v6 = ref()
const v7 = ref()
const collapsed = ref(true)
const dark = ref(true)

const iconMap: Record<string, any> = {
  home: Home20Regular,
  products: Box20Regular,
  'all-products': Box20Regular,
  categories: Tag20Regular,
  tags: Tag20Regular,
  settings: Settings20Regular,
  profile: Person20Regular,
  system: Settings20Regular,
  about: Info20Regular,
  info: Info20Regular,
  electronics: Laptop20Regular,
  clothing: Gift20Regular,
  food: Food20Regular,
  security: Shield20Regular,
  notification: Mail20Regular
}

const collapsedItems = [
  { label: $t('demo.common.home'), key: 'home', icon: 'home' },
  {
    label: $t('demo.common.products'),
    key: 'products',
    icon: 'products',
    children: [
      { label: $t('demo.common.allProducts'), key: 'all-products', icon: 'all-products' },
      {
        label: $t('demo.common.categories'),
        key: 'categories',
        icon: 'categories',
        children: [
          { label: $t('demo.common.electronics'), key: 'electronics', icon: 'electronics' },
          { label: $t('demo.common.clothing'), key: 'clothing', icon: 'clothing' },
          { label: $t('demo.common.food'), key: 'food', icon: 'food' }
        ]
      },
      { label: $t('demo.common.tags'), key: 'tags', icon: 'tags' }
    ]
  },
  {
    label: $t('demo.common.settings'),
    key: 'settings',
    icon: 'settings',
    children: [
      { label: $t('demo.common.profile'), key: 'profile', icon: 'profile' },
      {
        label: $t('demo.common.systemSettings'),
        key: 'system',
        icon: 'system',
        children: [
          { label: $t('demo.common.securitySettings'), key: 'security', icon: 'security' },
          { label: $t('demo.common.notificationSettings'), key: 'notification', icon: 'notification' }
        ]
      }
    ]
  },
  { label: $t('demo.common.about'), key: 'about', icon: 'about' }
]

const iconItems = [
  { label: $t('demo.common.home'), key: 'home', icon: 'home' },
  { label: $t('demo.common.settings'), key: 'settings', icon: 'settings' },
  { label: $t('demo.common.about'), key: 'info', icon: 'info' }
]

const fnIconItems = [
  { label: $t('demo.common.home'), key: 'home', icon: () => h(Icon, { icon: Home20Regular }) },
  { label: $t('demo.common.settings'), key: 'settings', icon: () => h(Icon, { icon: Settings20Regular }) },
  { label: $t('demo.common.about'), key: 'info', icon: () => h(Icon, { icon: Info20Regular }) }
]

function onSelect(_item: any) {}
function onSelect2(_item: any) {}
function onSelect3(_item: any) {}
function onSelect4(_item: any) {}
function onSelect5(_item: any) {}
function onSelect6(_item: any) {}
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
