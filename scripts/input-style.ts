import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'

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

export function useInputStyleMode(getStyleMode: () => InputStyleMode) {
  const group = useInputGroupStyle()

  return computed(() => group?.styleMode.value ?? getStyleMode())
}

export function useInputSize(getSize: () => InputSize) {
  const group = useInputGroupStyle()

  return computed(() => group?.size.value ?? getSize())
}

export function useInputStyle(getStyleMode: () => InputStyleMode, getSize: () => InputSize) {
  const group = useInputGroupStyle()

  return {
    styleMode: computed(() => group?.styleMode.value ?? getStyleMode()),
    size: computed(() => group?.size.value ?? getSize()),
  }
}
