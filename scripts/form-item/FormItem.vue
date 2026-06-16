<template>
  <div class="yiz-form-item" :class="vClass" @focusout="onFieldBlur">
    <div v-if="label || $slots.label" class="yiz-form-item-label" :style="labelStyle">
      <span v-if="isRequired" class="yiz-form-item-required">*</span>
      <Tooltip v-if="hasTooltip" :content="tooltip" placement="top">
        <span class="yiz-form-item-label-text yiz-form-item-label-tooltip">
          <slot name="label">{{ label }}</slot>
        </span>
        <template v-if="$slots.tooltip" #content>
          <slot name="tooltip" />
        </template>
      </Tooltip>
      <span v-else class="yiz-form-item-label-text">
        <slot name="label">{{ label }}</slot>
      </span>
    </div>
    <div class="yiz-form-item-content">
      <slot />
      <div
        v-if="hasValidationRules"
        class="yiz-form-item-error"
        :class="{ 'yiz-form-item-error-visible': errorMessage }"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { $t } from '../locale'
import { Tooltip } from '../tooltip'
import {
  formContextKey,
  type FormItemContext,
  type FormItemRule,
  type FormItemValidateResult,
  type FormRule,
  type FormValidateTrigger
} from '../form/types'

const props = defineProps<{
  label?: string
  prop?: string
  required?: boolean
  rules?: FormItemRule | FormItemRule[]
  labelWidth?: string | number
  tooltip?: string
}>()

defineSlots<{
  default?: any
  label?: any
  tooltip?: any
}>()

const slots = useSlots()
const form = inject(formContextKey, null)
const validateState = ref<'idle' | 'validating' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const initialValue = ref<any>()
let hasInitialValue = false
let isResetting = false

const fieldLabel = computed(() => props.label || props.prop || '')

const formItemRules = computed<FormRule[]>(() => {
  const rules: FormRule[] = []
  const formRule = props.prop ? form?.rules.value[props.prop] : undefined
  rules.push(...normalizeRules(formRule))
  rules.push(...normalizeRules(props.rules))
  if (props.required && !rules.some((rule) => rule.required)) {
    rules.unshift({ required: true })
  }
  return rules
})

const isRequired = computed(() => {
  return props.required || formItemRules.value.some((rule) => rule.required)
})

const hasValidationRules = computed(() => formItemRules.value.length > 0)
const hasTooltip = computed(() => Boolean(props.tooltip || slots.tooltip))

const fieldValue = computed(() => {
  if (!form || !props.prop) return undefined
  return getValueByPath(form.model.value, props.prop)
})

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (form?.labelPosition.value) {
    c[`yiz-form-item-label-${form.labelPosition.value}`] = true
  }
  if (validateState.value === 'error') {
    c['yiz-form-item-error-status'] = true
  }
  if (isRequired.value) {
    c['yiz-form-item-is-required'] = true
  }
  return c
})

const labelStyle = computed(() => {
  const s: Record<string, string> = {}
  const position = form?.labelPosition.value ?? 'right'
  if (position !== 'top') {
    const width = props.labelWidth ?? form?.labelWidth.value
    if (width !== undefined) {
      s.width = typeof width === 'number' ? `${width}px` : width
    }
    s.textAlign = position
  }
  return s
})

const itemContext: FormItemContext = {
  prop: props.prop,
  validate,
  resetField,
  clearValidate
}

watch(
  fieldValue,
  () => {
    if (isResetting) return
    validate('change')
  },
  { deep: true }
)

onMounted(() => {
  initialValue.value = cloneValue(fieldValue.value)
  hasInitialValue = true
  form?.addItem(itemContext)
})

onBeforeUnmount(() => {
  form?.removeItem(itemContext)
})

function normalizeRules(rules?: FormItemRule | FormItemRule[]): FormRule[] {
  if (!rules) return []
  return Array.isArray(rules) ? rules : [rules]
}

function getValueByPath(model: Record<string, any>, path: string) {
  return path.split('.').reduce((current, key) => current?.[key], model)
}

function setValueByPath(model: Record<string, any>, path: string, value: any) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return
  let current = model
  keys.forEach((key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  })
  current[lastKey] = value
}

function cloneValue(value: any) {
  if (Array.isArray(value)) return [...value]
  if (value && typeof value === 'object') return { ...value }
  return value
}

function isEmpty(value: any) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function getLengthOrValue(value: any) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  return undefined
}

function shouldValidateRule(rule: FormRule, trigger?: FormValidateTrigger) {
  if (!trigger || trigger === 'submit') return true
  if (!rule.trigger) return true
  return Array.isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger
}

function getRuleMessage(rule: FormRule) {
  return rule.message || $t('form.required', { label: fieldLabel.value })
}

async function validateRule(rule: FormRule): Promise<FormItemValidateResult> {
  const value = fieldValue.value

  if (rule.required && isEmpty(value)) {
    return { valid: false, message: getRuleMessage(rule) }
  }

  if (!isEmpty(value) && rule.pattern) {
    const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
    if (!pattern.test(String(value))) {
      return { valid: false, message: rule.message || $t('form.pattern', { label: fieldLabel.value }) }
    }
  }

  const measure = getLengthOrValue(value)
  if (!isEmpty(value) && rule.len !== undefined && measure !== rule.len) {
    return { valid: false, message: rule.message || $t('form.length', { label: fieldLabel.value, len: rule.len }) }
  }
  if (!isEmpty(value) && rule.min !== undefined && measure !== undefined && measure < rule.min) {
    return { valid: false, message: rule.message || $t('form.min', { label: fieldLabel.value, min: rule.min }) }
  }
  if (!isEmpty(value) && rule.max !== undefined && measure !== undefined && measure > rule.max) {
    return { valid: false, message: rule.message || $t('form.max', { label: fieldLabel.value, max: rule.max }) }
  }

  if (rule.validator) {
    const result = await rule.validator(value, form?.model.value ?? {})
    if (result === false) {
      return { valid: false, message: getRuleMessage(rule) }
    }
    if (typeof result === 'string') {
      return { valid: false, message: result }
    }
    if (result instanceof Error) {
      return { valid: false, message: result.message }
    }
  }

  return { valid: true }
}

async function validate(trigger?: FormValidateTrigger): Promise<FormItemValidateResult> {
  if (!props.prop) {
    clearValidate()
    return { valid: true }
  }

  const matchedRules = formItemRules.value.filter((rule) => shouldValidateRule(rule, trigger))
  if (matchedRules.length === 0) {
    clearValidate()
    return { valid: true }
  }

  validateState.value = 'validating'
  for (const rule of matchedRules) {
    const result = await validateRule(rule)
    if (!result.valid) {
      validateState.value = 'error'
      errorMessage.value = result.message ?? ''
      return result
    }
  }

  validateState.value = 'success'
  errorMessage.value = ''
  return { valid: true }
}

function clearValidate() {
  validateState.value = 'idle'
  errorMessage.value = ''
}

function resetField() {
  if (!form || !props.prop || !hasInitialValue) return
  isResetting = true
  setValueByPath(form.model.value, props.prop, cloneValue(initialValue.value))
  clearValidate()
  nextTick(() => {
    isResetting = false
  })
}

function onFieldBlur() {
  validate('blur')
}

defineExpose({
  validate,
  resetField,
  clearValidate
})
</script>

<style lang="less">
.yiz-form-item {
  display: flex;
  align-items: flex-start;
  color: #333;

  &:last-child {
    margin-bottom: 0;
  }
}

.yiz-form-item-label {
  flex-shrink: 0;
  min-height: 32px;
  padding-right: 12px;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.88);
  box-sizing: border-box;
}

.yiz-form-item-required {
  margin-right: 4px;
  color: var(--yiz-color-error);
  font-family: SimSun, sans-serif;
}

.yiz-form-item-label-text {
  display: inline-flex;
  align-items: center;
}

.yiz-form-item-label-tooltip {
  cursor: help;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.yiz-form-item-content {
  position: relative;
  flex: 1;
  min-width: 0;
  line-height: 32px;
}

.yiz-form-item-label-top {
  display: block;

  .yiz-form-item-label {
    width: auto;
    min-height: auto;
    padding-right: 0;
    padding-bottom: 6px;
    line-height: 1.4;
    text-align: left;
  }
}

.yiz-form-item-error {
  padding-top: 2px;
  min-height: 19px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--yiz-color-error);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-form-item-error-visible {
  opacity: 1;
}
</style>
