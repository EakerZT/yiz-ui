import type { DemoDefinition } from '../types'
import IndicatorTypeDemo from './IndicatorTypeDemo.vue'
import indicatorTypeDemoSource from './IndicatorTypeDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import TipTextDemo from './TipTextDemo.vue'
import tipTextDemoSource from './TipTextDemo.vue?raw'
import ContainerModeDemo from './ContainerModeDemo.vue'
import containerModeDemoSource from './ContainerModeDemo.vue?raw'
import DelayShowDemo from './DelayShowDemo.vue'
import delayShowDemoSource from './DelayShowDemo.vue?raw'

export const demos: DemoDefinition[] = [
  {
    id: 'IndicatorTypeDemo',
    titleKey: 'demo.loading.indicatorType',
    component: IndicatorTypeDemo,
    source: indicatorTypeDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'TipTextDemo', titleKey: 'demo.loading.tipText', component: TipTextDemo, source: tipTextDemoSource },
  {
    id: 'ContainerModeDemo',
    titleKey: 'demo.loading.containerMode',
    component: ContainerModeDemo,
    source: containerModeDemoSource,
  },
  { id: 'DelayShowDemo', titleKey: 'demo.loading.delayShow', component: DelayShowDemo, source: delayShowDemoSource },
]

export const apiComponents = ['Loading']
