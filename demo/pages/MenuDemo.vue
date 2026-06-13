<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Menu 导航菜单</h2>
    <p class="demo-section-desc">垂直导航菜单，支持子菜单和选中状态。</p>

    <y-card title="基础" style="margin-top: 8px">
      <y-menu v-model:select="v1" :items="opts" @select="onSelect" />
      <span class="demo-hint">选中: {{ v1 }}</span>
    </y-card>

    <y-card title="子菜单" style="margin-top: 8px">
      <y-menu v-model:select="v2" :items="navItems" @select="onSelect2" />
      <span class="demo-hint">选中: {{ v2 }}</span>
    </y-card>

    <y-card title="插槽" style="margin-top: 8px">
      <y-menu v-model:select="v3" @select="onSelect3">
        <y-menu-option label="查看" value="view" />
        <y-menu-option label="编辑" value="edit" />
        <y-menu-option label="删除" value="delete" />
      </y-menu>
      <span class="demo-hint">选中: {{ v3 }}</span>
    </y-card>

    <y-card title="自定义渲染" style="margin-top: 8px">
      <y-menu v-model:select="v4" :items="navItems" @select="onSelect4">
        <template #item="{ item }">
          <span style="display: flex; align-items: center; gap: 6px">
            <span style="color: var(--yiz-color-primary); font-weight: 600">·</span>
            {{ item.label }}
          </span>
        </template>
      </y-menu>
      <span class="demo-hint">选中: {{ v4 }}</span>
    </y-card>

    <y-card title="图标-字符串" style="margin-top: 8px">
      <y-menu v-model:select="v5" :items="iconItems" @select="onSelect5">
        <template #icon="{ icon }">
          <Icon :icon="iconMap[icon]" />
        </template>
      </y-menu>
      <span class="demo-hint">选中: {{ v5 }}</span>
    </y-card>

    <y-card title="图标-函数" style="margin-top: 8px">
      <y-menu v-model:select="v6" :items="fnIconItems" @select="onSelect6" />
      <span class="demo-hint">选中: {{ v6 }}</span>
    </y-card>

    <y-card title="折叠" style="margin-top: 8px">
      <div class="demo-menu-toolbar">
        <y-switch v-model="dark" />
        <span class="demo-hint">{{ dark ? 'dark' : 'light' }}</span>
        <y-switch v-model="collapsed" />
        <span class="demo-hint">{{ collapsed ? 'collapsed' : 'expanded' }}</span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 12px">
        <y-menu v-model:select="v7" :items="collapsedItems" :collapsed="collapsed" :dark="dark" @select="onSelect7">
          <template #icon="{ icon }">
            <Icon :icon="iconMap[icon]" />
          </template>
        </y-menu>
      </div>
      <span class="demo-hint">选中: {{ v7 }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
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
  { label: '查看', value: 'view' },
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' }
]

const navItems = [
  { label: '首页', value: 'home' },
  {
    label: '产品',
    value: 'products',
    children: [
      { label: '全部产品', value: 'all-products' },
      { label: '分类管理', value: 'categories' },
      { label: '标签管理', value: 'tags' }
    ]
  },
  {
    label: '设置',
    value: 'settings',
    children: [
      { label: '个人设置', value: 'profile' },
      { label: '系统设置', value: 'system' }
    ]
  },
  { label: '关于', value: 'about' }
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
  { label: '首页', value: 'home', icon: 'home' },
  {
    label: '产品',
    value: 'products',
    icon: 'products',
    children: [
      { label: '全部产品', value: 'all-products', icon: 'all-products' },
      {
        label: '分类管理',
        value: 'categories',
        icon: 'categories',
        children: [
          { label: '电子产品', value: 'electronics', icon: 'electronics' },
          { label: '服装', value: 'clothing', icon: 'clothing' },
          { label: '食品', value: 'food', icon: 'food' }
        ]
      },
      { label: '标签管理', value: 'tags', icon: 'tags' }
    ]
  },
  {
    label: '设置',
    value: 'settings',
    icon: 'settings',
    children: [
      { label: '个人设置', value: 'profile', icon: 'profile' },
      {
        label: '系统设置',
        value: 'system',
        icon: 'system',
        children: [
          { label: '安全设置', value: 'security', icon: 'security' },
          { label: '通知设置', value: 'notification', icon: 'notification' }
        ]
      }
    ]
  },
  { label: '关于', value: 'about', icon: 'about' }
]

const iconItems = [
  { label: '首页', value: 'home', icon: 'home' },
  { label: '设置', value: 'settings', icon: 'settings' },
  { label: '关于', value: 'info', icon: 'info' }
]

const fnIconItems = [
  { label: '首页', value: 'home', icon: () => h(Icon, { icon: Home20Regular }) },
  { label: '设置', value: 'settings', icon: () => h(Icon, { icon: Settings20Regular }) },
  { label: '关于', value: 'info', icon: () => h(Icon, { icon: Info20Regular }) }
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
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
