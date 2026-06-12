<template>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>Yiz UI</h1>
      <span class="demo-header-sub">Vue 3 组件库</span>
    </header>
    <div class="demo-body">
      <aside class="demo-sidebar">
        <scroll-box height="100%" width="100%">
          <y-menu v-model:select="currentPage" :items="menuItems" :width="200" @select="onNavSelect" />
        </scroll-box>
      </aside>
      <main class="demo-main">
        <scroll-box height="100%" width="100%">
          <component :is="currentDemo" />
        </scroll-box>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ButtonDemo from './pages/ButtonDemo.vue'
import CardDemo from './pages/CardDemo.vue'
import CheckboxDemo from './pages/CheckboxDemo.vue'
import ContextMenuDemo from './pages/ContextMenuDemo.vue'
import DatePickerDemo from './pages/DatePickerDemo.vue'
import EmptyDemo from './pages/EmptyDemo.vue'
import InputDemo from './pages/InputDemo.vue'
import InputNumberDemo from './pages/InputNumberDemo.vue'
import LoadingDemo from './pages/LoadingDemo.vue'
import MenuDemo from './pages/MenuDemo.vue'
import IconDemo from './pages/IconDemo.vue'
import RadioDemo from './pages/RadioDemo.vue'
import ScrollBoxDemo from './pages/ScrollBoxDemo.vue'
import SelectDemo from './pages/SelectDemo.vue'
import SwitchDemo from './pages/SwitchDemo.vue'
import TabDemo from './pages/TabDemo.vue'
import TableDemo from './pages/TableDemo.vue'
import TagDemo from './pages/TagDemo.vue'
import TimePickerDemo from './pages/TimePickerDemo.vue'
import DialogDemo from './pages/DialogDemo.vue'
import DrawerDemo from './pages/DrawerDemo.vue'
import TooltipDemo from './pages/TooltipDemo.vue'
import { ScrollBox } from 'yiz-ui'

const pages: Record<string, any> = {
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  'context-menu': ContextMenuDemo,
  'date-picker': DatePickerDemo,
  empty: EmptyDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  input: InputDemo,
  'input-number': InputNumberDemo,
  loading: LoadingDemo,
  menu: MenuDemo,
  radio: RadioDemo,
  'scroll-box': ScrollBoxDemo,
  select: SelectDemo,
  switch: SwitchDemo,
  tab: TabDemo,
  table: TableDemo,
  tag: TagDemo,
  'time-picker': TimePickerDemo,
  tooltip: TooltipDemo,
  icon: IconDemo
}

const menuItems = [
  { label: 'Button 按钮', value: 'button' },
  { label: 'Card 卡片', value: 'card' },
  { label: 'Checkbox 复选', value: 'checkbox' },
  { label: 'ContextMenu 菜单', value: 'context-menu' },
  { label: 'DatePicker 日期', value: 'date-picker' },
  { label: 'Empty 空状态', value: 'empty' },
  { label: 'Dialog 弹窗', value: 'dialog' },
  { label: 'Drawer 抽屉', value: 'drawer' },
  { label: 'Icon 图标', value: 'icon' },
  { label: 'Input 输入框', value: 'input' },
  { label: 'InputNumber 数字', value: 'input-number' },
  { label: 'Loading 加载', value: 'loading' },
  { label: 'Menu 菜单', value: 'menu' },
  { label: 'Radio 单选', value: 'radio' },
  { label: 'ScrollBox 滚动框', value: 'scroll-box' },
  { label: 'Select 下拉框', value: 'select' },
  { label: 'Switch 开关', value: 'switch' },
  { label: 'Tab 标签页', value: 'tab' },
  { label: 'Table 表格', value: 'table' },
  { label: 'Tag 标签', value: 'tag' },
  { label: 'TimePicker 时间', value: 'time-picker' },
  { label: 'Tooltip 提示', value: 'tooltip' }
]

function getPageFromHash(): string {
  const m = location.hash.match(/^#\/([\w-]+)/)
  return m?.[1] || 'button'
}

const currentPage = ref(getPageFromHash())

const currentDemo = computed(() => pages[currentPage.value] || ButtonDemo)

function onHashChange() {
  currentPage.value = getPageFromHash()
}

function onNavSelect(item: any) {
  location.hash = `#/${item.value}`
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.demo-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  color: #333;
  overflow: hidden;
}

.demo-header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
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
  overflow: hidden;
}

.demo-sidebar {
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
}

.demo-main {
  flex: 1;
  overflow: hidden;
}

.demo-section {
  padding: 24px 32px;
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
