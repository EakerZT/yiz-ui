import type { DemoDefinition } from '../types'
import StatusDemo from './StatusDemo.vue'
import statusDemoSource from './StatusDemo.vue?raw'
import ActionsDemo from './ActionsDemo.vue'
import actionsDemoSource from './ActionsDemo.vue?raw'
import EventLogDemo from './EventLogDemo.vue'
import eventLogDemoSource from './EventLogDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'StatusDemo', titleKey: 'demo.layerManager.status', component: StatusDemo, source: statusDemoSource },
  { id: 'ActionsDemo', titleKey: 'demo.layerManager.actions', component: ActionsDemo, source: actionsDemoSource },
  { id: 'EventLogDemo', titleKey: 'demo.layerManager.eventLog', component: EventLogDemo, source: eventLogDemoSource },
]

export const apiComponents = ['LayerManager']
