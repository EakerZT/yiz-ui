<template>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>Yiz UI</h1>
      <span class="demo-header-sub">{{ $t('demo.app.title') }}</span>
      <div class="demo-header-actions">
        <a class="demo-header-icon" href="https://github.com/EakerZT/yiz-ui" target="_blank" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
        </a>
        <a class="demo-header-icon" href="https://www.npmjs.com/package/@eakerzt/yiz-ui" target="_blank" title="npm">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
            />
          </svg>
        </a>
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
import FormDemo from './pages/FormDemo.vue'
import DividerDemo from './pages/DividerDemo.vue'
import DropmenuDemo from './pages/DropmenuDemo.vue'
import InputDemo from './pages/InputDemo.vue'
import InputPasswordDemo from './pages/InputPasswordDemo.vue'
import InputNumberDemo from './pages/InputNumberDemo.vue'
import LoadingDemo from './pages/LoadingDemo.vue'
import MenuDemo from './pages/MenuDemo.vue'
import NotificationDemo from './pages/NotificationDemo.vue'
import IconDemo from './pages/IconDemo.vue'
import PaginationDemo from './pages/PaginationDemo.vue'
import RadioDemo from './pages/RadioDemo.vue'
import ScrollBoxDemo from './pages/ScrollBoxDemo.vue'
import SegmentedDemo from './pages/SegmentedDemo.vue'
import SliderDemo from './pages/SliderDemo.vue'
import SortableBoxDemo from './pages/SortableBoxDemo.vue'
import SelectDemo from './pages/SelectDemo.vue'
import SwitchDemo from './pages/SwitchDemo.vue'
import TabDemo from './pages/TabDemo.vue'
import TableDemo from './pages/TableDemo.vue'
import TagDemo from './pages/TagDemo.vue'
import TimePickerDemo from './pages/TimePickerDemo.vue'
import TimeRangePickerDemo from './pages/TimeRangePickerDemo.vue'
import TimelineDemo from './pages/TimelineDemo.vue'
import DialogDemo from './pages/DialogDemo.vue'
import DrawerDemo from './pages/DrawerDemo.vue'
import TooltipDemo from './pages/TooltipDemo.vue'
import TextareaDemo from './pages/TextareaDemo.vue'
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
  form: FormDemo,
  dialog: DialogDemo,
  divider: DividerDemo,
  dropmenu: DropmenuDemo,
  drawer: DrawerDemo,
  input: InputDemo,
  'input-password': InputPasswordDemo,
  'input-number': InputNumberDemo,
  loading: LoadingDemo,
  menu: MenuDemo,
  notification: NotificationDemo,
  pagination: PaginationDemo,
  radio: RadioDemo,
  'scroll-box': ScrollBoxDemo,
  segmented: SegmentedDemo,
  slider: SliderDemo,
  'sortable-box': SortableBoxDemo,
  select: SelectDemo,
  switch: SwitchDemo,
  tab: TabDemo,
  textarea: TextareaDemo,
  table: TableDemo,
  tag: TagDemo,
  timeline: TimelineDemo,
  'time-picker': TimePickerDemo,
  'time-range-picker': TimeRangePickerDemo,
  tooltip: TooltipDemo,
  tree: TreeDemo,
  icon: IconDemo
}

const menuItems = computed(() => [
  { label: $t('demo.nav.button'), key: 'button' },
  { label: $t('demo.nav.card'), key: 'card' },
  { label: $t('demo.nav.checkbox'), key: 'checkbox' },
  { label: $t('demo.nav.colorPicker'), key: 'color-picker' },
  { label: $t('demo.nav.contextMenu'), key: 'context-menu' },
  { label: $t('demo.nav.datePicker'), key: 'date-picker' },
  { label: $t('demo.nav.dateRangePicker'), key: 'date-range-picker' },
  { label: $t('demo.nav.empty'), key: 'empty' },
  { label: $t('demo.nav.form'), key: 'form' },
  { label: $t('demo.nav.dialog'), key: 'dialog' },
  { label: $t('demo.nav.divider'), key: 'divider' },
  { label: $t('demo.nav.dropmenu'), key: 'dropmenu' },
  { label: $t('demo.nav.drawer'), key: 'drawer' },
  { label: $t('demo.nav.icon'), key: 'icon' },
  { label: $t('demo.nav.input'), key: 'input' },
  { label: $t('demo.nav.inputPassword'), key: 'input-password' },
  { label: $t('demo.nav.inputNumber'), key: 'input-number' },
  { label: $t('demo.nav.loading'), key: 'loading' },
  { label: $t('demo.nav.menu'), key: 'menu' },
  { label: $t('demo.nav.notification'), key: 'notification' },
  { label: $t('demo.nav.pagination'), key: 'pagination' },
  { label: $t('demo.nav.radio'), key: 'radio' },
  { label: $t('demo.nav.scrollBox'), key: 'scroll-box' },
  { label: $t('demo.nav.segmented'), key: 'segmented' },
  { label: $t('demo.nav.slider'), key: 'slider' },
  { label: $t('demo.nav.sortableBox'), key: 'sortable-box' },
  { label: $t('demo.nav.select'), key: 'select' },
  { label: $t('demo.nav.switch'), key: 'switch' },
  { label: $t('demo.nav.tab'), key: 'tab' },
  { label: $t('demo.nav.textarea'), key: 'textarea' },
  { label: $t('demo.nav.table'), key: 'table' },
  { label: $t('demo.nav.tag'), key: 'tag' },
  { label: $t('demo.nav.timeline'), key: 'timeline' },
  { label: $t('demo.nav.timePicker'), key: 'time-picker' },
  { label: $t('demo.nav.timeRangePicker'), key: 'time-range-picker' },
  { label: $t('demo.nav.tooltip'), key: 'tooltip' },
  { label: $t('demo.nav.tree'), key: 'tree' }
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
  location.hash = `#/${item.key}`
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
.demo-header-icon {
  display: inline-flex;
  align-items: center;
  color: #666;
  transition: color 0.2s;
}
.demo-header-icon:hover {
  color: #333;
}
.demo-header-icon svg {
  width: 20px;
  height: 20px;
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
  align-items: flex-start;
  flex-wrap: wrap;
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
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}
.demo-item {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.demo-item-hint {
  flex-basis: 100%;
  margin-left: 106px;
  margin-top: -6px;
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
