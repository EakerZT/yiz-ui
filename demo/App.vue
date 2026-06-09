<template>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>Yiz UI</h1>
      <span class="demo-header-sub">Vue 3 组件库</span>
    </header>
    <div class="demo-body">
      <nav class="demo-nav">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#/${item.id}`"
          class="demo-nav-item"
          :class="{ active: currentPage === item.id }"
        >{{ item.label }}</a>
      </nav>
      <main class="demo-main">
        <component :is="currentDemo" />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ButtonDemo from './pages/ButtonDemo.vue'
import CheckboxDemo from './pages/CheckboxDemo.vue'
import InputDemo from './pages/InputDemo.vue'
import IconDemo from './pages/IconDemo.vue'
import RadioDemo from './pages/RadioDemo.vue'
import DrawerDemo from './pages/DrawerDemo.vue'
import TooltipDemo from './pages/TooltipDemo.vue'

const pages: Record<string, any> = {
  button: ButtonDemo,
  checkbox: CheckboxDemo,
  drawer: DrawerDemo,
  input: InputDemo,
  radio: RadioDemo,
  tooltip: TooltipDemo,
  icon: IconDemo,
}

const navItems = [
  { id: 'button', label: 'Button 按钮' },
  { id: 'checkbox', label: 'Checkbox 复选' },
  { id: 'drawer', label: 'Drawer 抽屉' },
  { id: 'input', label: 'Input 输入框' },
  { id: 'radio', label: 'Radio 单选' },
  { id: 'tooltip', label: 'Tooltip 提示' },
  { id: 'icon', label: 'Icon 图标' },
]

function getPageFromHash(): string {
  const m = location.hash.match(/^#\/(\w+)/)
  return m?.[1] || 'button'
}

const currentPage = ref(getPageFromHash())

const currentDemo = computed(() => pages[currentPage.value] || ButtonDemo)

function onHashChange() {
  currentPage.value = getPageFromHash()
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})

watch(currentPage, (val) => {
  if (location.hash !== `#/${val}`) {
    history.replaceState(null, '', `#/${val}`)
  }
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

.demo-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  color: #333;
}

.demo-header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}
.demo-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--yiz-color-primary);
}
.demo-header-sub {
  font-size: 13px;
  color: #999;
}

.demo-body {
  display: flex;
  flex: 1;
}

.demo-nav {
  width: 200px;
  padding: 16px 0;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  flex-shrink: 0;
}
.demo-nav-item {
  display: block;
  padding: 8px 24px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.demo-nav-item:hover {
  color: var(--yiz-color-primary);
  background: #f0f5ff;
}
.demo-nav-item.active {
  color: var(--yiz-color-primary);
  border-left-color: var(--yiz-color-primary);
  background: #f0f5ff;
}

.demo-main {
  flex: 1;
  padding: 24px 32px;
  max-width: 960px;
}

.demo-section {
  margin-bottom: 48px;
}
.demo-section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}
.demo-section-desc {
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
  line-height: 1.6;
}

.demo-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 16px;
}
.demo-label {
  width: 90px;
  flex-shrink: 0;
  font-size: 13px;
  color: #999;
  text-align: right;
}
.demo-items {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.demo-item {
  display: inline-flex;
  align-items: center;
}
.demo-item-hint {
  font-size: 13px;
  color: #bbb;
}
.demo-item-icon {
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}
.demo-item-icon em {
  font-style: normal;
  color: #bbb;
}
</style>
