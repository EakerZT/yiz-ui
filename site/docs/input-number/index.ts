import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import StepDemo from './StepDemo.vue'
import stepDemoSource from './StepDemo.vue?raw'
import RangeDemo from './RangeDemo.vue'
import rangeDemoSource from './RangeDemo.vue?raw'
import PrecisionDemo from './PrecisionDemo.vue'
import precisionDemoSource from './PrecisionDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import NoControlsDemo from './NoControlsDemo.vue'
import noControlsDemoSource from './NoControlsDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'
import SpacingDemo from './SpacingDemo.vue'
import spacingDemoSource from './SpacingDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'StepDemo', titleKey: 'demo.inputNumber.step', component: StepDemo, source: stepDemoSource },
  { id: 'RangeDemo', titleKey: 'demo.inputNumber.range', component: RangeDemo, source: rangeDemoSource },
  {
    id: 'PrecisionDemo',
    titleKey: 'demo.inputNumber.precision',
    component: PrecisionDemo,
    source: precisionDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  {
    id: 'NoControlsDemo',
    titleKey: 'demo.inputNumber.noControls',
    component: NoControlsDemo,
    source: noControlsDemoSource,
  },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
  {
    id: 'SpacingDemo',
    titleKey: 'demo.inputNumber.sizeSpacing',
    component: SpacingDemo,
    source: spacingDemoSource,
  },
]

export const apiComponents = ['InputNumber']
