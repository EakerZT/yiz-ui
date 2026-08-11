import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  provide,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type WatchStopHandle,
} from 'vue'

export interface ModalLayerManager {
  onActivate: (callback: () => void) => () => void
  onDeactivate: (callback: () => void) => () => void
  isTopLayer: ComputedRef<boolean>
  count: ComputedRef<number>
  index: ComputedRef<number>
}

export interface ModalLayer extends ModalLayerManager {
  active: () => void
  inactive: () => void
}

export interface ModalLayerContext extends ModalLayer {
  id: symbol
}

type ModalLayerMode = 'layer' | 'manager'

const modalLayerKey: InjectionKey<ModalLayerContext> = Symbol('yizModalLayer')
export const modalLayerRootKey: InjectionKey<boolean> = Symbol('yizModalLayerRoot')
const layerStack = shallowRef<ModalLayerContext[]>([])
const instanceModes = new WeakMap<object, ModalLayerMode>()
const instanceLayers = new WeakMap<object, ModalLayerContext>()
const noopModalLayer = createNoopModalLayer()

function setInstanceMode(mode: ModalLayerMode) {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error(`${mode === 'layer' ? 'useModalLayer' : 'useModalLayerManager'} must be called in setup().`)
  }

  const existed = instanceModes.get(instance)
  if (existed && existed !== mode) {
    throw new Error('useModalLayer() and useModalLayerManager() cannot be used in the same component.')
  }
  if (existed === 'layer' && mode === 'layer') {
    throw new Error('useModalLayer() cannot be called more than once in the same component.')
  }

  instanceModes.set(instance, mode)
  return instance
}

function createNoopModalLayer(): ModalLayerContext {
  const count = computed(() => 0)
  const index = computed(() => -1)
  const isTopLayer = computed(() => true)

  return {
    id: Symbol('yizNoopModalLayer'),
    active: () => undefined,
    inactive: () => undefined,
    onActivate: () => () => undefined,
    onDeactivate: () => () => undefined,
    isTopLayer,
    count,
    index,
  }
}

function createModalLayerContext(): ModalLayerContext {
  const layer = {} as ModalLayerContext
  const index = computed(() => layerStack.value.indexOf(layer))
  const count = computed(() => layerStack.value.length)
  const isTopLayer = computed(() => index.value >= 0 && index.value === count.value - 1)

  Object.assign(layer, {
    id: Symbol('yizModalLayer'),
    active: () => {
      if (layerStack.value.includes(layer)) return
      layerStack.value = [...layerStack.value, layer]
    },
    inactive: () => {
      if (!layerStack.value.includes(layer)) return
      layerStack.value = layerStack.value.filter((item) => item !== layer)
    },
    onActivate: (callback: () => void) => watchTopLayer(isTopLayer, true, callback),
    onDeactivate: (callback: () => void) => watchTopLayer(isTopLayer, false, callback),
    isTopLayer,
    count,
    index,
  })

  return layer
}

function watchTopLayer(isTopLayer: ComputedRef<boolean>, targetValue: boolean, callback: () => void): () => void {
  const stop: WatchStopHandle = watch(isTopLayer, (value, oldValue) => {
    if (value === targetValue && oldValue !== targetValue) {
      callback()
    }
  })

  onBeforeUnmount(stop)
  return stop
}

function provideModalLayer(layer: ModalLayerContext) {
  provide(modalLayerKey, layer)
}

export function useModalLayer(): ModalLayer {
  const instance = setInstanceMode('layer')
  const layer = createModalLayerContext()

  instanceLayers.set(instance, layer)
  provideModalLayer(layer)
  onBeforeUnmount(layer.inactive)

  return layer
}

export function useModalLayerManager(): ModalLayerManager {
  const instance = setInstanceMode('manager')
  const layer = inject(modalLayerKey, null)
  if (!layer) {
    throw new Error(
      'useModalLayerManager() must be called under a modal layer. Call useModalLayer().active() in a parent component first.',
    )
  }

  instanceLayers.set(instance, layer)
  return layer
}

export function useOptionalModalLayer(parentLayer?: ModalLayerContext | null): ModalLayer {
  const parent = parentLayer ?? inject(modalLayerKey, null)
  const hasRoot = inject(modalLayerRootKey, false)
  if (!parent && !hasRoot) return noopModalLayer

  const layer = createModalLayerContext()
  provideModalLayer(layer)
  onBeforeUnmount(layer.inactive)
  return layer
}

export function provideModalLayerRoot() {
  provide(modalLayerRootKey, true)
}

export function injectModalLayerRoot(): boolean {
  return inject(modalLayerRootKey, false)
}

export function injectModalLayer(): ModalLayerContext | null {
  return inject(modalLayerKey, null)
}

export function getModalLayer(instance: object): ModalLayerContext | null {
  return instanceLayers.get(instance) ?? null
}
