<template>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>Yiz UI</h1>
      <span class="demo-header-sub">{{ $t('demo.app.title') }}</span>
      <div class="demo-header-actions">
        <span class="demo-lang-label">{{ $t('demo.app.lang') }}</span>
        <y-select
          :model-value="demoLang"
          :options="demoLangOptions"
          size="small"
          style="width: 120px"
          @update:model-value="setDemoLang"
        />
      </div>
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
import ColorPickerDemo from './pages/ColorPickerDemo.vue'
import ContextMenuDemo from './pages/ContextMenuDemo.vue'
import DatePickerDemo from './pages/DatePickerDemo.vue'
import DateRangePickerDemo from './pages/DateRangePickerDemo.vue'
import EmptyDemo from './pages/EmptyDemo.vue'
import InputDemo from './pages/InputDemo.vue'
import InputNumberDemo from './pages/InputNumberDemo.vue'
import LoadingDemo from './pages/LoadingDemo.vue'
import MenuDemo from './pages/MenuDemo.vue'
import NotificationDemo from './pages/NotificationDemo.vue'
import IconDemo from './pages/IconDemo.vue'
import PaginationDemo from './pages/PaginationDemo.vue'
import RadioDemo from './pages/RadioDemo.vue'
import ScrollBoxDemo from './pages/ScrollBoxDemo.vue'
import SelectDemo from './pages/SelectDemo.vue'
import SwitchDemo from './pages/SwitchDemo.vue'
import TabDemo from './pages/TabDemo.vue'
import TableDemo from './pages/TableDemo.vue'
import TagDemo from './pages/TagDemo.vue'
import TimePickerDemo from './pages/TimePickerDemo.vue'
import TimeRangePickerDemo from './pages/TimeRangePickerDemo.vue'
import DialogDemo from './pages/DialogDemo.vue'
import DrawerDemo from './pages/DrawerDemo.vue'
import TooltipDemo from './pages/TooltipDemo.vue'
import TreeDemo from './pages/TreeDemo.vue'
import { ScrollBox } from 'yiz-ui'
import { demoLang, demoLangOptions, setDemoLang, $t } from './i18n'

const pages: Record<string, any> = {
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  'color-picker': ColorPickerDemo,
  'context-menu': ContextMenuDemo,
  'date-picker': DatePickerDemo,
  'date-range-picker': DateRangePickerDemo,
  empty: EmptyDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  input: InputDemo,
  'input-number': InputNumberDemo,
  loading: LoadingDemo,
  menu: MenuDemo,
  notification: NotificationDemo,
  pagination: PaginationDemo,
  radio: RadioDemo,
  'scroll-box': ScrollBoxDemo,
  select: SelectDemo,
  switch: SwitchDemo,
  tab: TabDemo,
  table: TableDemo,
  tag: TagDemo,
  'time-picker': TimePickerDemo,
  'time-range-picker': TimeRangePickerDemo,
  tooltip: TooltipDemo,
  tree: TreeDemo,
  icon: IconDemo
}

const menuItems = computed(() => [
  { label: $t('demo.nav.button'), value: 'button' },
  { label: $t('demo.nav.card'), value: 'card' },
  { label: $t('demo.nav.checkbox'), value: 'checkbox' },
  { label: $t('demo.nav.colorPicker'), value: 'color-picker' },
  { label: $t('demo.nav.contextMenu'), value: 'context-menu' },
  { label: $t('demo.nav.datePicker'), value: 'date-picker' },
  { label: $t('demo.nav.dateRangePicker'), value: 'date-range-picker' },
  { label: $t('demo.nav.empty'), value: 'empty' },
  { label: $t('demo.nav.dialog'), value: 'dialog' },
  { label: $t('demo.nav.drawer'), value: 'drawer' },
  { label: $t('demo.nav.icon'), value: 'icon' },
  { label: $t('demo.nav.input'), value: 'input' },
  { label: $t('demo.nav.inputNumber'), value: 'input-number' },
  { label: $t('demo.nav.loading'), value: 'loading' },
  { label: $t('demo.nav.menu'), value: 'menu' },
  { label: $t('demo.nav.notification'), value: 'notification' },
  { label: $t('demo.nav.pagination'), value: 'pagination' },
  { label: $t('demo.nav.radio'), value: 'radio' },
  { label: $t('demo.nav.scrollBox'), value: 'scroll-box' },
  { label: $t('demo.nav.select'), value: 'select' },
  { label: $t('demo.nav.switch'), value: 'switch' },
  { label: $t('demo.nav.tab'), value: 'tab' },
  { label: $t('demo.nav.table'), value: 'table' },
  { label: $t('demo.nav.tag'), value: 'tag' },
  { label: $t('demo.nav.timePicker'), value: 'time-picker' },
  { label: $t('demo.nav.timeRangePicker'), value: 'time-range-picker' },
  { label: $t('demo.nav.tooltip'), value: 'tooltip' },
  { label: $t('demo.nav.tree'), value: 'tree' }
])

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
.demo-header-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.demo-lang-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
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
