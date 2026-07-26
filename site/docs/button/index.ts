import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicSource from './BasicDemo.vue?raw'
import ClickDemo from './ClickDemo.vue'
import clickSource from './ClickDemo.vue?raw'
import ColorDemo from './ColorDemo.vue'
import colorSource from './ColorDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorSource from './CustomColorDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledSource from './DisabledDemo.vue?raw'
import IconDemo from './IconDemo.vue'
import iconSource from './IconDemo.vue?raw'
import LinkBasicDemo from './LinkBasicDemo.vue'
import linkBasicSource from './LinkBasicDemo.vue?raw'
import LinkClickDemo from './LinkClickDemo.vue'
import linkClickSource from './LinkClickDemo.vue?raw'
import LinkColorDemo from './LinkColorDemo.vue'
import linkColorSource from './LinkColorDemo.vue?raw'
import LinkDisabledDemo from './LinkDisabledDemo.vue'
import linkDisabledSource from './LinkDisabledDemo.vue?raw'
import LinkUnderlineDemo from './LinkUnderlineDemo.vue'
import linkUnderlineSource from './LinkUnderlineDemo.vue?raw'
import LoadingDemo from './LoadingDemo.vue'
import loadingSource from './LoadingDemo.vue?raw'
import ShapeDemo from './ShapeDemo.vue'
import shapeSource from './ShapeDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeSource from './SizeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicSource },
  { id: 'ColorDemo', titleKey: 'demo.button.color', component: ColorDemo, source: colorSource },
  { id: 'CustomColorDemo', titleKey: 'demo.button.customColor', component: CustomColorDemo, source: customColorSource },
  { id: 'ShapeDemo', titleKey: 'demo.button.shape', component: ShapeDemo, source: shapeSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeSource },
  { id: 'IconDemo', titleKey: 'demo.common.withIcon', component: IconDemo, source: iconSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledSource },
  { id: 'LoadingDemo', titleKey: 'demo.common.loading', component: LoadingDemo, source: loadingSource },
  { id: 'ClickDemo', titleKey: 'demo.button.clickEvent', component: ClickDemo, source: clickSource },
  { id: 'LinkBasicDemo', titleKey: 'demo.button.link', component: LinkBasicDemo, source: linkBasicSource },
  { id: 'LinkColorDemo', titleKey: 'demo.button.linkColor', component: LinkColorDemo, source: linkColorSource },
  {
    id: 'LinkUnderlineDemo',
    titleKey: 'demo.button.linkUnderline',
    component: LinkUnderlineDemo,
    source: linkUnderlineSource,
  },
  {
    id: 'LinkDisabledDemo',
    titleKey: 'demo.button.linkDisabled',
    component: LinkDisabledDemo,
    source: linkDisabledSource,
  },
  { id: 'LinkClickDemo', titleKey: 'demo.button.linkClick', component: LinkClickDemo, source: linkClickSource },
]

export const apiComponents = ['Button', 'ButtonGroup', 'LinkButton']
