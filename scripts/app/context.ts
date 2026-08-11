import { computed, inject, type ComputedRef, type CSSProperties, type InjectionKey } from 'vue'
import { useTheme } from '../theme'

export type TeleportTarget = string | HTMLElement

export interface AppRuntimeContext {
  teleportTo: ComputedRef<TeleportTarget>
}

export const appRuntimeContextKey: InjectionKey<AppRuntimeContext> = Symbol('yizAppRuntime')
const defaultRuntimeContext: AppRuntimeContext = {
  teleportTo: computed<TeleportTarget>(() => 'body'),
}

export function useAppRuntime(): AppRuntimeContext {
  return inject(appRuntimeContextKey, defaultRuntimeContext)
}

export function useAppTeleport(): {
  teleportTo: ComputedRef<TeleportTarget>
  teleportTheme: ComputedRef<CSSProperties>
} {
  const runtime = useAppRuntime()
  const { cssVars } = useTheme()
  return {
    teleportTo: runtime.teleportTo,
    teleportTheme: cssVars,
  }
}
