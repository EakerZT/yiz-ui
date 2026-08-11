import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'
import { useTheme } from './theme'

export type InputStyleMode = 'outlined' | 'filled'
export type InputSize = 'small' | 'default' | 'large'

interface InputGroupStyleContext {
  styleMode: Ref<InputStyleMode>
  size: Ref<InputSize>
}

export const inputGroupStyleKey: InjectionKey<InputGroupStyleContext | null> = Symbol('yizInputGroupStyle')

function useInputGroupStyle() {
  const group = inject(inputGroupStyleKey, null)

  // 输入组件是样式边界，避免 InputGroup 的模式继续影响组件内部的辅助输入框。
  provide(inputGroupStyleKey, null)

  return group
}

export function useInputStyleMode(getStyleMode: () => InputStyleMode | undefined) {
  const group = useInputGroupStyle()
  const { theme } = useTheme()

  return computed(() => group?.styleMode.value ?? getStyleMode() ?? theme.value.styleMode)
}

export function useInputSize(getSize: () => InputSize | undefined) {
  const group = useInputGroupStyle()
  const { theme } = useTheme()

  return computed(() => group?.size.value ?? getSize() ?? theme.value.size)
}

export function useInputStyle(getStyleMode: () => InputStyleMode | undefined, getSize: () => InputSize | undefined) {
  const group = useInputGroupStyle()
  const { theme } = useTheme()

  return {
    styleMode: computed(() => group?.styleMode.value ?? getStyleMode() ?? theme.value.styleMode),
    size: computed(() => group?.size.value ?? getSize() ?? theme.value.size),
  }
}
