import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import RowsDemo from './RowsDemo.vue'
import rowsDemoSource from './RowsDemo.vue?raw'
import MaxlengthDemo from './MaxlengthDemo.vue'
import maxlengthDemoSource from './MaxlengthDemo.vue?raw'
import ClearableDemo from './ClearableDemo.vue'
import clearableDemoSource from './ClearableDemo.vue?raw'
import ResizeDemo from './ResizeDemo.vue'
import resizeDemoSource from './ResizeDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'RowsDemo', titleKey: 'demo.textarea.rows', component: RowsDemo, source: rowsDemoSource },
  { id: 'MaxlengthDemo', titleKey: 'demo.textarea.maxlength', component: MaxlengthDemo, source: maxlengthDemoSource },
  { id: 'ClearableDemo', titleKey: 'demo.textarea.clearable', component: ClearableDemo, source: clearableDemoSource },
  { id: 'ResizeDemo', titleKey: 'demo.textarea.resize', component: ResizeDemo, source: resizeDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
]

export const apiComponents = ['Textarea']
