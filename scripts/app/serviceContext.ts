import { createVNode, defineComponent, h, provide, type Ref, type VNode } from 'vue'
import { appRuntimeContextKey, useAppRuntime, type AppRuntimeContext } from './context'
import { localeContextKey, useLocaleRef, type Lang } from '../locale'
import { injectModalLayerRoot, modalLayerRootKey } from '../overlay/modalLayer'
import { themeContextKey, useTheme, type ThemeContext } from '../theme'
import { useZIndexManager, zIndexManagerKey, type ZIndexManager } from '../zIndex'

export interface ServiceContext {
  theme: ThemeContext
  locale: Ref<Lang>
  runtime: AppRuntimeContext
  zIndex: ZIndexManager
  hasModalLayerRoot: boolean
}

const ServiceContextBridge = defineComponent({
  name: 'YizServiceContextBridge',
  props: {
    context: {
      type: Object as () => ServiceContext,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(themeContextKey, props.context.theme)
    provide(localeContextKey, props.context.locale)
    provide(appRuntimeContextKey, props.context.runtime)
    provide(zIndexManagerKey, props.context.zIndex)
    provide(modalLayerRootKey, props.context.hasModalLayerRoot)
    return () => h('div', { style: { display: 'contents' } }, slots.default?.())
  },
})

export function useServiceContext(): ServiceContext {
  return {
    theme: useTheme(),
    locale: useLocaleRef(),
    runtime: useAppRuntime(),
    zIndex: useZIndexManager(),
    hasModalLayerRoot: injectModalLayerRoot(),
  }
}

export function withServiceContext(vnode: VNode, context?: ServiceContext): VNode {
  if (!context) return vnode
  return createVNode(ServiceContextBridge, { context }, { default: () => vnode })
}

export function resolveServiceTarget(context?: ServiceContext): HTMLElement {
  const overlayTarget = context?.runtime.overlayTarget.value
  if (overlayTarget) return overlayTarget
  const target = context?.runtime.teleportTo.value ?? 'body'
  if (typeof target !== 'string') return target
  return document.querySelector<HTMLElement>(target) ?? document.body
}

export function applyServiceTheme(element: HTMLElement, context?: ServiceContext) {
  if (!context) return
  const themeClass = context.runtime.themeClass
  if (themeClass) {
    element.classList.add(themeClass)
    return
  }
  const styles = context.theme.cssVars.value as Record<string, string | number | undefined>
  for (const [name, value] of Object.entries(styles)) {
    if (value == null) continue
    if (name.startsWith('--')) element.style.setProperty(name, String(value))
    else if (name === 'colorScheme') element.style.colorScheme = String(value)
  }
}
