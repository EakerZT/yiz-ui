import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SlotDemo from './SlotDemo.vue'
import slotDemoSource from './SlotDemo.vue?raw'
import HorizontalDemo from './HorizontalDemo.vue'
import horizontalDemoSource from './HorizontalDemo.vue?raw'
import VerticalDemo from './VerticalDemo.vue'
import verticalDemoSource from './VerticalDemo.vue?raw'
import SlotGroupDemo from './SlotGroupDemo.vue'
import slotGroupDemoSource from './SlotGroupDemo.vue?raw'
import RadioGroupDisabledDemo from './RadioGroupDisabledDemo.vue'
import radioGroupDisabledDemoSource from './RadioGroupDisabledDemo.vue?raw'
import StandaloneDemo from './StandaloneDemo.vue'
import standaloneDemoSource from './StandaloneDemo.vue?raw'
import GroupOptionsDemo from './GroupOptionsDemo.vue'
import groupOptionsDemoSource from './GroupOptionsDemo.vue?raw'
import RadioButtonGroupSlotGroupDemo from './RadioButtonGroupSlotGroupDemo.vue'
import radioButtonGroupSlotGroupDemoSource from './RadioButtonGroupSlotGroupDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorDemoSource from './CustomColorDemo.vue?raw'
import CustomRenderDemo from './CustomRenderDemo.vue'
import customRenderDemoSource from './CustomRenderDemo.vue?raw'
import RadioButtonGroupDisabledDemo from './RadioButtonGroupDisabledDemo.vue'
import radioButtonGroupDisabledDemoSource from './RadioButtonGroupDisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SlotDemo', titleKey: 'demo.common.slot', component: SlotDemo, source: slotDemoSource },
  { id: 'HorizontalDemo', titleKey: 'demo.common.horizontal', component: HorizontalDemo, source: horizontalDemoSource },
  { id: 'VerticalDemo', titleKey: 'demo.common.vertical', component: VerticalDemo, source: verticalDemoSource },
  { id: 'SlotGroupDemo', titleKey: 'demo.radio.slotGroup', component: SlotGroupDemo, source: slotGroupDemoSource },
  {
    id: 'RadioGroupDisabledDemo',
    titleKey: 'demo.common.disabled',
    component: RadioGroupDisabledDemo,
    source: radioGroupDisabledDemoSource,
  },
  { id: 'StandaloneDemo', titleKey: 'demo.radio.standalone', component: StandaloneDemo, source: standaloneDemoSource },
  {
    id: 'GroupOptionsDemo',
    titleKey: 'demo.radio.groupOptions',
    component: GroupOptionsDemo,
    source: groupOptionsDemoSource,
  },
  {
    id: 'RadioButtonGroupSlotGroupDemo',
    titleKey: 'demo.radio.slotGroup',
    component: RadioButtonGroupSlotGroupDemo,
    source: radioButtonGroupSlotGroupDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'CustomColorDemo',
    titleKey: 'demo.common.customColor',
    component: CustomColorDemo,
    source: customColorDemoSource,
  },
  {
    id: 'CustomRenderDemo',
    titleKey: 'demo.common.customRender',
    component: CustomRenderDemo,
    source: customRenderDemoSource,
  },
  {
    id: 'RadioButtonGroupDisabledDemo',
    titleKey: 'demo.common.disabled',
    component: RadioButtonGroupDisabledDemo,
    source: radioButtonGroupDisabledDemoSource,
  },
]

export const apiComponents = ['Radio', 'RadioGroup', 'RadioButton', 'RadioButtonGroup']
