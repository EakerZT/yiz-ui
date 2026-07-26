import type { DemoDefinition } from '../types'
import OptionsDemo from './OptionsDemo.vue'
import optionsDemoSource from './OptionsDemo.vue?raw'
import SlotDemo from './SlotDemo.vue'
import slotDemoSource from './SlotDemo.vue?raw'
import SubmenuDemo from './SubmenuDemo.vue'
import submenuDemoSource from './SubmenuDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'OptionsDemo', titleKey: 'demo.dropmenu.options', component: OptionsDemo, source: optionsDemoSource },
  { id: 'SlotDemo', titleKey: 'demo.common.slot', component: SlotDemo, source: slotDemoSource },
  { id: 'SubmenuDemo', titleKey: 'demo.menu.submenu', component: SubmenuDemo, source: submenuDemoSource },
]

export const apiComponents = ['Dropmenu', 'DropmenuItem']
