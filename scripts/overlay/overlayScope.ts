import { inject, nextTick, onBeforeUnmount, provide, watch, type InjectionKey, type Ref } from 'vue'

export type OverlayScopeId = symbol

const overlayScopeKey: InjectionKey<OverlayScopeId> = Symbol('yizOverlayScope')
const overlayElements = new Map<OverlayScopeId, Set<HTMLElement>>()

export function createOverlayScope(): OverlayScopeId {
  const scope = Symbol('yizOverlayScope')
  overlayElements.set(scope, new Set())
  return scope
}

export function provideOverlayScope(scope: OverlayScopeId) {
  provide(overlayScopeKey, scope)
}

export function injectOverlayScope(): OverlayScopeId | null {
  return inject(overlayScopeKey, null)
}

export function registerOverlayElement(scope: OverlayScopeId, element: HTMLElement): () => void {
  let elements = overlayElements.get(scope)
  if (!elements) {
    elements = new Set()
    overlayElements.set(scope, elements)
  }

  elements.add(element)
  return () => {
    elements?.delete(element)
  }
}

export function isInOverlayScope(scope: OverlayScopeId, target: HTMLElement): boolean {
  const elements = overlayElements.get(scope)
  if (!elements) return false

  for (const element of elements) {
    if (element === target || element.contains(target)) return true
  }
  return false
}

export function disposeOverlayScope(scope: OverlayScopeId) {
  overlayElements.delete(scope)
}

export function useOverlayElement(elementRef: Ref<HTMLElement | undefined>, visible: Ref<boolean>) {
  const scope = injectOverlayScope()
  let unregister: (() => void) | null = null

  function cleanup() {
    unregister?.()
    unregister = null
  }

  watch(visible, async (open) => {
    cleanup()
    if (!open || !scope) return
    await nextTick()
    if (visible.value && elementRef.value) {
      unregister = registerOverlayElement(scope, elementRef.value)
    }
  })

  onBeforeUnmount(cleanup)
}
