import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type FormModel = Record<string, any>
export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormValidateTrigger = 'blur' | 'change' | 'submit'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: FormValidateTrigger | FormValidateTrigger[]
  pattern?: RegExp | string
  min?: number
  max?: number
  len?: number
  validator?: (
    value: any,
    model: FormModel,
  ) => boolean | string | Error | void | Promise<boolean | string | Error | void>
}

export type FormItemRule = FormRule
export type FormRules = Record<string, FormRule | FormRule[]>

export interface FormItemValidateResult {
  valid: boolean
  message?: string
}

export interface FormItemContext {
  prop?: string
  validate: (trigger?: FormValidateTrigger) => Promise<FormItemValidateResult>
  resetField: () => void
  clearValidate: () => void
}

export interface FormContext {
  model: ComputedRef<FormModel>
  rules: ComputedRef<FormRules>
  labelWidth: Ref<string | number | undefined>
  layout: Ref<FormLayout>
  addItem: (item: FormItemContext) => void
  removeItem: (item: FormItemContext) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('yizForm')
