<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Menu 导航菜单</h2>
    <p class="demo-section-desc">垂直导航菜单，支持子菜单和选中状态。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-menu v-model="v1" :items="opts" @select="onSelect" /></span>
        <span class="demo-item-hint">选中: {{ v1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">子菜单</span>
      <div class="demo-items">
        <span class="demo-item"><y-menu v-model="v2" :items="navItems" @select="onSelect2" /></span>
        <span class="demo-item-hint">选中: {{ v2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-menu v-model="v3" @select="onSelect3">
            <y-menu-option label="查看" value="view" />
            <y-menu-option label="编辑" value="edit" />
            <y-menu-option label="删除" value="delete" />
          </y-menu>
        </span>
        <span class="demo-item-hint">选中: {{ v3 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义渲染</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-menu v-model="v4" :items="navItems" @select="onSelect4">
            <template #item="{ item }">
              <span style="display:flex;align-items:center;gap:6px">
                <span style="color:var(--yiz-color-primary);font-weight:600">·</span>
                {{ item.label }}
              </span>
            </template>
          </y-menu>
        </span>
        <span class="demo-item-hint">选中: {{ v4 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">图标-字符串</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-menu v-model="v5" :items="iconItems" @select="onSelect5">
            <template #icon="{ icon }">
              <Icon size="16" :icon="iconMap[icon]" />
            </template>
          </y-menu>
        </span>
        <span class="demo-item-hint">选中: {{ v5 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">图标-函数</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-menu v-model="v6" :items="fnIconItems" @select="onSelect6" />
        </span>
        <span class="demo-item-hint">选中: {{ v6 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">折叠</span>
      <div class="demo-items">
        <span class="demo-item" style="display:flex;align-items:flex-start;gap:12px">
          <y-menu v-model="v7" :items="collapsedItems" :collapsed="collapsed" @select="onSelect7">
            <template #icon="{ icon }">
              <Icon size="16" :icon="iconMap[icon]" />
            </template>
          </y-menu>
          <y-button size="small" @click="collapsed = !collapsed">{{ collapsed ? '展开' : '折叠' }}</y-button>
        </span>
        <span class="demo-item-hint">选中: {{ v7 }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { Home16Filled, Settings16Filled, Info16Filled, Box16Filled, Tag16Filled, Person16Filled, Laptop16Filled, Food16Filled, Gift16Filled, Shield16Filled, Mail16Filled } from '@vicons/fluent'
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

const iconMap: Record<string, any> = {
  home: Home16Filled,
  products: Box16Filled,
  'all-products': Box16Filled,
  categories: Tag16Filled,
  tags: Tag16Filled,
  settings: Settings16Filled,
  profile: Person16Filled,
  system: Settings16Filled,
  about: Info16Filled,
  info: Info16Filled,
  electronics: Laptop16Filled,
  clothing: Gift16Filled,
  food: Food16Filled,
  security: Shield16Filled,
  notification: Mail16Filled
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
  { label: '首页', value: 'home', icon: () => h(Icon, { icon: Home16Filled, size: '16' }) },
  { label: '设置', value: 'settings', icon: () => h(Icon, { icon: Settings16Filled, size: '16' }) },
  { label: '关于', value: 'info', icon: () => h(Icon, { icon: Info16Filled, size: '16' }) }
]

function onSelect(item: any) {}
function onSelect2(item: any) {}
function onSelect3(item: any) {}
function onSelect4(item: any) {}
function onSelect5(item: any) {}
function onSelect6(item: any) {}
function onSelect7(item: any) {}
</script>
