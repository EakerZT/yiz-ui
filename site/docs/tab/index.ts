import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import MoreTabsDemo from './MoreTabsDemo.vue'
import moreTabsDemoSource from './MoreTabsDemo.vue?raw'
import CustomLabelDemo from './CustomLabelDemo.vue'
import customLabelDemoSource from './CustomLabelDemo.vue?raw'
import DirectionsDemo from './DirectionsDemo.vue'
import directionsDemoSource from './DirectionsDemo.vue?raw'
import CardTypeDemo from './CardTypeDemo.vue'
import cardTypeDemoSource from './CardTypeDemo.vue?raw'
import CardDirectionsDemo from './CardDirectionsDemo.vue'
import cardDirectionsDemoSource from './CardDirectionsDemo.vue?raw'
import TransitionsDemo from './TransitionsDemo.vue'
import transitionsDemoSource from './TransitionsDemo.vue?raw'
import FlexModeDemo from './FlexModeDemo.vue'
import flexModeDemoSource from './FlexModeDemo.vue?raw'
import OverflowTabsDemo from './OverflowTabsDemo.vue'
import overflowTabsDemoSource from './OverflowTabsDemo.vue?raw'
import ExtraSlotsDemo from './ExtraSlotsDemo.vue'
import extraSlotsDemoSource from './ExtraSlotsDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'MoreTabsDemo', titleKey: 'demo.tab.moreTabs', component: MoreTabsDemo, source: moreTabsDemoSource },
  {
    id: 'CustomLabelDemo',
    titleKey: 'demo.tab.customLabel',
    component: CustomLabelDemo,
    source: customLabelDemoSource,
  },
  { id: 'DirectionsDemo', titleKey: 'demo.tab.directions', component: DirectionsDemo, source: directionsDemoSource },
  { id: 'CardTypeDemo', titleKey: 'demo.tab.cardType', component: CardTypeDemo, source: cardTypeDemoSource },
  {
    id: 'CardDirectionsDemo',
    titleKey: 'demo.tab.cardDirections',
    component: CardDirectionsDemo,
    source: cardDirectionsDemoSource,
  },
  {
    id: 'TransitionsDemo',
    titleKey: 'demo.tab.transitions',
    component: TransitionsDemo,
    source: transitionsDemoSource,
  },
  { id: 'FlexModeDemo', titleKey: 'demo.tab.flexMode', component: FlexModeDemo, source: flexModeDemoSource },
  {
    id: 'OverflowTabsDemo',
    titleKey: 'demo.tab.overflowTabs',
    component: OverflowTabsDemo,
    source: overflowTabsDemoSource,
  },
  { id: 'ExtraSlotsDemo', titleKey: 'demo.tab.extraSlots', component: ExtraSlotsDemo, source: extraSlotsDemoSource },
]

export const apiComponents = ['Tab', 'TabPane']
