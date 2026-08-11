<template>
  <y-form ref="basicFormRef" :model="basicForm" :rules="rules" :label-width="96" @validate="onValidate">
    <y-form-item :label="t('demo.common.name')" prop="name" :tooltip="t('demo.form.nameTooltip')">
      <y-input v-model:value="basicForm.name" :placeholder="t('demo.form.namePlaceholder')" clearable />
    </y-form-item>
    <y-form-item :label="t('demo.common.city')" prop="city">
      <y-select
        v-model:value="basicForm.city"
        :options="cityOptions"
        :placeholder="t('demo.form.cityPlaceholder')"
        clearable
      />
    </y-form-item>
    <y-form-item :label="t('demo.common.age')" prop="age">
      <template #tooltip>
        <span>{{ t('demo.form.ageTooltip') }}</span>
      </template>
      <y-input-number v-model:value="basicForm.age" :min="0" :max="120" :placeholder="t('demo.form.agePlaceholder')" />
    </y-form-item>
    <y-form-item :label="t('demo.form.accountType')" prop="accountType">
      <y-radio-group v-model:value="basicForm.accountType" :options="accountTypeOptions" />
    </y-form-item>
    <y-form-item :label="t('demo.form.skills')" prop="skills">
      <y-checkbox-group v-model:value="basicForm.skills" :options="skillOptions" />
    </y-form-item>
  </y-form>
  <div class="form-demo-actions">
    <y-button type="primary" @click="submitBasicForm">{{ t('demo.form.submit') }}</y-button>
    <y-button @click="resetBasicForm">{{ t('demo.form.reset') }}</y-button>
    <span class="form-demo-hint">{{ submitResult }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useLocale, type FormRules } from 'yiz-ui'

const t = useLocale()

interface FormExpose {
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
}

const basicFormRef = ref<FormExpose>()

const basicForm = reactive({
  name: '',
  city: undefined as string | undefined,
  age: null as number | null,
  accountType: 'personal',
  skills: [] as string[],
})

const cityOptions = computed(() => [
  { label: t('demo.common.beijing'), value: 'beijing' },
  { label: t('demo.common.shanghai'), value: 'shanghai' },
  { label: t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: t('demo.common.shenzhen'), value: 'shenzhen' },
])

const accountTypeOptions = computed(() => [
  { label: t('demo.form.personal'), value: 'personal' },
  { label: t('demo.form.company'), value: 'company' },
])

const skillOptions = computed(() => [
  { label: t('demo.form.skillDesign'), value: 'design' },
  { label: t('demo.form.skillDevelop'), value: 'develop' },
  { label: t('demo.form.skillOperate'), value: 'operate' },
])

const rules: FormRules = {
  name: [
    { required: true, trigger: 'blur' },
    { min: 2, max: 12, trigger: 'change' },
  ],
  city: { required: true, trigger: 'change' },
  age: {
    trigger: 'blur',
    validator(value) {
      if (value == null) return t('demo.form.ageRequired')
      if (value < 18) return t('demo.form.ageMin')
      return true
    },
  },
  accountType: { required: true, trigger: 'change' },
  skills: { required: true, trigger: 'change' },
}

const isValid = ref(false)

const submitResult = computed(() => {
  if (isValid.value) {
    return t('demo.form.valid')
  }
  return t('demo.form.waiting')
})

async function submitBasicForm() {
  isValid.value = (await basicFormRef.value?.validate()) ?? false
}

function resetBasicForm() {
  basicFormRef.value?.resetFields()
  isValid.value = false
}

function onValidate(valid: boolean) {
  isValid.value = valid
}
</script>

<style scoped>
.form-demo-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding-left: 96px;
}

.form-demo-hint {
  font-size: 12px;
  color: #999;
}
</style>
