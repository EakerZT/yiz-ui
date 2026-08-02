import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'

export type InputStyleMode = 'outlined' | 'filled'

interface InputGroupStyleContext {
  styleMode: Ref<InputStyleMode>
}

export const inputGroupStyleKey: InjectionKey<InputGroupStyleContext | null> = Symbol('yizInputGroupStyle')

export function useInputStyleMode(getStyleMode: () => InputStyleMode) {
  const group = inject(inputGroupStyleKey, null)

  // 输入组件是样式边界，避免 InputGroup 的模式继续影响组件内部的辅助输入框。
  provide(inputGroupStyleKey, null)

  return computed(() => group?.styleMode.value ?? getStyleMode())
}
