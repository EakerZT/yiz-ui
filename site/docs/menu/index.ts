import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import SubmenuDemo from './SubmenuDemo.vue'
import submenuDemoSource from './SubmenuDemo.vue?raw'
import SlotDemo from './SlotDemo.vue'
import slotDemoSource from './SlotDemo.vue?raw'
import CustomRenderDemo from './CustomRenderDemo.vue'
import customRenderDemoSource from './CustomRenderDemo.vue?raw'
import IconStringDemo from './IconStringDemo.vue'
import iconStringDemoSource from './IconStringDemo.vue?raw'
import IconFnDemo from './IconFnDemo.vue'
import iconFnDemoSource from './IconFnDemo.vue?raw'
import CollapsedDemo from './CollapsedDemo.vue'
import collapsedDemoSource from './CollapsedDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'SubmenuDemo', titleKey: 'demo.menu.submenu', component: SubmenuDemo, source: submenuDemoSource },
  { id: 'SlotDemo', titleKey: 'demo.common.slot', component: SlotDemo, source: slotDemoSource },
  {
    id: 'CustomRenderDemo',
    titleKey: 'demo.common.customRender',
    component: CustomRenderDemo,
    source: customRenderDemoSource,
  },
  { id: 'IconStringDemo', titleKey: 'demo.menu.iconString', component: IconStringDemo, source: iconStringDemoSource },
  { id: 'IconFnDemo', titleKey: 'demo.menu.iconFn', component: IconFnDemo, source: iconFnDemoSource },
  { id: 'CollapsedDemo', titleKey: 'demo.menu.collapsed', component: CollapsedDemo, source: collapsedDemoSource },
]

export const apiComponents = ['Menu', 'MenuOption']
