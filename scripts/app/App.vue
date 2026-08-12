<template>
  <div class="yiz-app" :class="[themeClass, { 'yiz-app-dark': resolvedTheme.darkMode }]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeMount, onMounted, onUnmounted, provide, shallowRef, watch } from 'vue'
import { appRuntimeContextKey } from './context'
import { createThemeClass, createThemeStyle } from './themeStyle'
import { provideLocale, useLocaleRef, type Lang } from '../locale'
import { provideModalLayerRoot } from '../overlay/modalLayer'
import { createZIndexManager, provideZIndexManager, zIndexManagerKey } from '../zIndex'
import {
  lightTheme,
  mergeTheme,
  themeContextKey,
  themeToCssVars,
  type DeepPartial,
  type Theme,
  type ThemeContext,
} from '../theme'

const props = defineProps<{
  /**
   * 应用主题配置，可传入预设主题或局部覆盖。
   * @en App theme preset or partial overrides.
   */
  theme?: DeepPartial<Theme>
  /**
   * 覆盖主题的明暗计算模式，不负责从亮色主题生成暗色主题。
   * @en Overrides the color derivation mode without converting a light palette into a dark one.
   */
  darkMode?: boolean
  /**
   * 当前语言。
   * @en Current locale.
   */
  locale?: Lang
  /**
   * 浮层 z-index 起始值。
   * @en Starting z-index for overlays.
   */
  zIndex?: number
  /**
   * 浮层挂载目标。
   * @en Teleport target for overlays.
   */
  teleportTo?: string | HTMLElement
}>()

const parentTheme = inject(themeContextKey, null)
const parentRuntime = inject(appRuntimeContextKey, null)
const parentLocale = useLocaleRef()
const parentZIndex = inject(zIndexManagerKey, null)
const themeClass = createThemeClass()
const overlayTarget = shallowRef<HTMLElement | null>(null)
const teleportTo = computed(() => props.teleportTo ?? parentRuntime?.teleportTo.value ?? 'body')
const resolvedTheme = computed(() => {
  const theme = mergeTheme(parentTheme?.theme.value ?? (lightTheme as Theme), props.theme ?? {})
  return props.darkMode == null ? theme : { ...theme, darkMode: props.darkMode }
})
const cssVars = computed(() => themeToCssVars(resolvedTheme.value))
const context: ThemeContext = {
  theme: resolvedTheme,
  cssVars,
}

let overlayHost: HTMLElement | undefined
let themeStyle: ReturnType<typeof createThemeStyle> | undefined

function resolveTeleportTarget(target: string | HTMLElement): HTMLElement {
  if (typeof target !== 'string') return target
  return document.querySelector<HTMLElement>(target) ?? document.body
}

function syncOverlayHost() {
  if (!overlayHost) return
  const target = resolveTeleportTarget(teleportTo.value)
  if (overlayHost.parentElement !== target) target.appendChild(overlayHost)
}

onBeforeMount(() => {
  themeStyle = createThemeStyle(themeClass)
  themeStyle.update(cssVars.value)

  overlayHost = document.createElement('div')
  overlayHost.className = `yiz-app-overlay-container ${themeClass}`
  overlayTarget.value = overlayHost
  syncOverlayHost()
})

onMounted(syncOverlayHost)

watch(cssVars, (value) => themeStyle?.update(value))
watch(teleportTo, syncOverlayHost, { flush: 'post' })

onUnmounted(() => {
  overlayTarget.value = null
  overlayHost?.remove()
  themeStyle?.remove()
})

provide(themeContextKey, context)
provideModalLayerRoot()
provide(appRuntimeContextKey, {
  teleportTo,
  overlayTarget,
  themeClass,
})
provideLocale(computed(() => props.locale ?? parentLocale.value))
provideZIndexManager(
  props.zIndex == null && parentZIndex ? parentZIndex : createZIndexManager(computed(() => props.zIndex ?? 2000)),
)
</script>

<style lang="less">
.yiz-app {
  min-width: 0;
  color: var(--yiz-color-text-primary);
  background: var(--yiz-color-bg);
}

.yiz-app-overlay-container {
  display: contents;
}
</style>
