import { computed, inject, shallowRef, type ComputedRef, type InjectionKey, type ShallowRef } from 'vue'

export type TeleportTarget = string | HTMLElement

export interface AppRuntimeContext {
  teleportTo: ComputedRef<TeleportTarget>
  overlayTarget: ShallowRef<HTMLElement | null>
  themeClass?: string
}

export const appRuntimeContextKey: InjectionKey<AppRuntimeContext> = Symbol('yizAppRuntime')
const defaultRuntimeContext: AppRuntimeContext = {
  teleportTo: computed<TeleportTarget>(() => 'body'),
  overlayTarget: shallowRef(null),
}

export function useAppRuntime(): AppRuntimeContext {
  return inject(appRuntimeContextKey, defaultRuntimeContext)
}

export function useAppTeleport(): {
  teleportTo: ComputedRef<TeleportTarget>
} {
  const runtime = useAppRuntime()
  return {
    teleportTo: computed(() => runtime.overlayTarget.value ?? runtime.teleportTo.value),
  }
}
