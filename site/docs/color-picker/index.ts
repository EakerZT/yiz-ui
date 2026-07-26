import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import AlphaDemo from './AlphaDemo.vue'
import alphaDemoSource from './AlphaDemo.vue?raw'
import CustomPresetsDemo from './CustomPresetsDemo.vue'
import customPresetsDemoSource from './CustomPresetsDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'
import SizeAndDisabledDemo from './SizeAndDisabledDemo.vue'
import sizeAndDisabledDemoSource from './SizeAndDisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'AlphaDemo', titleKey: 'demo.colorPicker.alpha', component: AlphaDemo, source: alphaDemoSource },
  {
    id: 'CustomPresetsDemo',
    titleKey: 'demo.colorPicker.customPresets',
    component: CustomPresetsDemo,
    source: customPresetsDemoSource,
  },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
  {
    id: 'SizeAndDisabledDemo',
    titleKey: 'demo.colorPicker.sizeAndDisabled',
    component: SizeAndDisabledDemo,
    source: sizeAndDisabledDemoSource,
  },
]

export const apiComponents = ['ColorPicker']
