import type { ComputedRef, InjectionKey } from 'vue'

export interface DemoSourcePage {
  script: string
  styles: string[]
  demos: string[]
}

export const demoSourcePageKey: InjectionKey<ComputedRef<DemoSourcePage | undefined>> = Symbol('demoSourcePage')
