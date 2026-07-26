import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import StepDemo from './StepDemo.vue'
import stepDemoSource from './StepDemo.vue?raw'
import RangeDemo from './RangeDemo.vue'
import rangeDemoSource from './RangeDemo.vue?raw'
import MarksDemo from './MarksDemo.vue'
import marksDemoSource from './MarksDemo.vue?raw'
import TooltipDemo from './TooltipDemo.vue'
import tooltipDemoSource from './TooltipDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'StepDemo', titleKey: 'demo.slider.step', component: StepDemo, source: stepDemoSource },
  { id: 'RangeDemo', titleKey: 'demo.slider.range', component: RangeDemo, source: rangeDemoSource },
  { id: 'MarksDemo', titleKey: 'demo.slider.marks', component: MarksDemo, source: marksDemoSource },
  { id: 'TooltipDemo', titleKey: 'demo.slider.tooltip', component: TooltipDemo, source: tooltipDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
]

export const apiComponents = ['Slider']
