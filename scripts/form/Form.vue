<template>
  <form class="yiz-form" :class="vClass" @submit.prevent="onSubmit">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, toRef } from 'vue'
import { formContextKey, type FormContext, type FormItemContext, type FormLayout, type FormRules } from './types'

const props = withDefaults(
  defineProps<{
    model?: Record<string, any>
    rules?: FormRules
    labelWidth?: string | number
    layout?: FormLayout
  }>(),
  {
    model: () => ({}),
    rules: () => ({}),
    labelWidth: 96,
    layout: 'horizontal',
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{
  submit: [valid: boolean]
  validate: [valid: boolean]
}>()

const fields: FormItemContext[] = []

const modelRef = computed(() => props.model)
const rulesRef = computed(() => props.rules)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-form-layout-${props.layout}`] = true
  return c
})

function addItem(item: FormItemContext) {
  if (!fields.includes(item)) {
    fields.push(item)
  }
}

function removeItem(item: FormItemContext) {
  const index = fields.indexOf(item)
  if (index > -1) {
    fields.splice(index, 1)
  }
}

async function validate(callback?: (valid: boolean) => void): Promise<boolean> {
  const results = await Promise.all(fields.map((field) => field.validate('submit')))
  const valid = results.every((result) => result.valid)
  emit('validate', valid)
  callback?.(valid)
  return valid
}

async function validateField(prop: string): Promise<boolean> {
  const targetFields = fields.filter((field) => field.prop === prop)
  const results = await Promise.all(targetFields.map((field) => field.validate('submit')))
  return results.every((result) => result.valid)
}

function resetFields() {
  fields.forEach((field) => field.resetField())
}

function clearValidate(prop?: string) {
  fields.forEach((field) => {
    if (!prop || field.prop === prop) {
      field.clearValidate()
    }
  })
}

async function onSubmit() {
  const valid = await validate()
  emit('submit', valid)
}

const context: FormContext = {
  model: modelRef,
  rules: rulesRef,
  labelWidth: toRef(props, 'labelWidth'),
  layout: toRef(props, 'layout'),
  addItem,
  removeItem,
}

provide(formContextKey, context)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
})
</script>

<style lang="less">
.yiz-form {
  display: block;
  font-size: 14px;
  color: #333;
}

.yiz-form-layout-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}
</style>
