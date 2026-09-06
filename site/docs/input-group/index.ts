import type { DemoDefinition } from '../types'
import InlineAddonDemo from './InlineAddonDemo.vue'
import inlineAddonDemoSource from './InlineAddonDemo.vue?raw'
import AddonPropsDemo from './AddonPropsDemo.vue'
import addonPropsDemoSource from './AddonPropsDemo.vue?raw'
import AddonSlotsDemo from './AddonSlotsDemo.vue'
import addonSlotsDemoSource from './AddonSlotsDemo.vue?raw'
import SearchDemo from './SearchDemo.vue'
import searchDemoSource from './SearchDemo.vue?raw'
import BorderDemo from './BorderDemo.vue'
import borderDemoSource from './BorderDemo.vue?raw'
import PasswordDemo from './PasswordDemo.vue'
import passwordDemoSource from './PasswordDemo.vue?raw'
import PickersDemo from './PickersDemo.vue'
import pickersDemoSource from './PickersDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import BlockDemo from './BlockDemo.vue'
import blockDemoSource from './BlockDemo.vue?raw'
import StyleModeDemo from './StyleModeDemo.vue'
import styleModeDemoSource from './StyleModeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  {
    id: 'InlineAddonDemo',
    titleKey: 'demo.inputGroup.inlineAddon',
    component: InlineAddonDemo,
    source: inlineAddonDemoSource,
  },
  {
    id: 'StyleModeDemo',
    titleKey: 'demo.common.styleMode',
    component: StyleModeDemo,
    source: styleModeDemoSource,
  },
  {
    id: 'AddonPropsDemo',
    titleKey: 'demo.inputGroup.addonProps',
    component: AddonPropsDemo,
    source: addonPropsDemoSource,
  },
  {
    id: 'AddonSlotsDemo',
    titleKey: 'demo.inputGroup.addonSlots',
    component: AddonSlotsDemo,
    source: addonSlotsDemoSource,
  },
  { id: 'SearchDemo', titleKey: 'demo.inputGroup.search', component: SearchDemo, source: searchDemoSource },
  { id: 'BorderDemo', titleKey: 'demo.card.border', component: BorderDemo, source: borderDemoSource },
  { id: 'PasswordDemo', titleKey: 'demo.inputGroup.password', component: PasswordDemo, source: passwordDemoSource },
  { id: 'PickersDemo', titleKey: 'demo.inputGroup.pickers', component: PickersDemo, source: pickersDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'BlockDemo', titleKey: 'demo.inputGroup.block', component: BlockDemo, source: blockDemoSource },
]

export const apiComponents = ['InputGroup', 'InputAddon']
