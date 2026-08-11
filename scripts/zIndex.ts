import { inject, provide, type InjectionKey, type Ref } from 'vue'

export interface ZIndexManager {
  next: () => number
  current: () => number
}

export const zIndexManagerKey: InjectionKey<ZIndexManager> = Symbol('yizZIndexManager')

export function createZIndexManager(base: Ref<number>): ZIndexManager {
  let counter = base.value

  return {
    next: () => {
      counter = Math.max(counter, base.value) + 2
      return counter
    },
    current: () => Math.max(counter, base.value),
  }
}

const fallbackBase = { value: 2000 } as Ref<number>
const fallbackManager = createZIndexManager(fallbackBase)

export function provideZIndexManager(manager: ZIndexManager) {
  provide(zIndexManagerKey, manager)
}

export function useZIndexManager(): ZIndexManager {
  return inject(zIndexManagerKey, fallbackManager)
}

export function nextZIndex(): number {
  return fallbackManager.next()
}
