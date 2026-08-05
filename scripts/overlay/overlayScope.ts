import { inject, nextTick, onBeforeUnmount, provide, watch, type InjectionKey, type Ref } from 'vue'

export type OverlayScopeId = symbol

const overlayScopeKey: InjectionKey<OverlayScopeId> = Symbol('yizOverlayScope')
const overlayElements = new Map<OverlayScopeId, Set<HTMLElement>>()
const overlayChildren = new Map<OverlayScopeId, Set<OverlayScopeId>>()
const overlayParents = new Map<OverlayScopeId, OverlayScopeId>()

export function createOverlayScope(parent: OverlayScopeId | null = null): OverlayScopeId {
  const scope = Symbol('yizOverlayScope')
  overlayElements.set(scope, new Set())
  overlayChildren.set(scope, new Set())
  if (parent) {
    overlayParents.set(scope, parent)
    let children = overlayChildren.get(parent)
    if (!children) {
      children = new Set()
      overlayChildren.set(parent, children)
    }
    children.add(scope)
  }
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
  if (elements) {
    for (const element of elements) {
      if (element === target || element.contains(target)) return true
    }
  }

  for (const child of overlayChildren.get(scope) ?? []) {
    if (isInOverlayScope(child, target)) return true
  }

  return false
}

export function disposeOverlayScope(scope: OverlayScopeId) {
  const parent = overlayParents.get(scope)
  if (parent) overlayChildren.get(parent)?.delete(scope)
  overlayParents.delete(scope)
  for (const child of overlayChildren.get(scope) ?? []) overlayParents.delete(child)
  overlayChildren.delete(scope)
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
