<template>
  <div style="margin-bottom: 12px">
    <y-radio-button-group v-model:value="demoLayout" size="small">
      <y-radio-button value="horizontal">{{ t('demo.form.layoutHorizontal') }}</y-radio-button>
      <y-radio-button value="vertical">{{ t('demo.form.layoutVertical') }}</y-radio-button>
      <y-radio-button value="inline">{{ t('demo.form.layoutInline') }}</y-radio-button>
    </y-radio-button-group>
  </div>
  <y-form :model="layoutDemoForm" :layout="demoLayout" :label-width="80">
    <y-form-item :label="t('demo.common.name')">
      <y-input v-model:value="layoutDemoForm.name" :placeholder="t('demo.form.namePlaceholder')" />
    </y-form-item>
    <y-form-item :label="t('demo.common.city')">
      <y-select
        v-model:value="layoutDemoForm.city"
        :options="cityOptions"
        :placeholder="t('demo.form.cityPlaceholder')"
      />
    </y-form-item>
    <y-form-item :label="t('demo.common.age')">
      <y-input-number v-model:value="layoutDemoForm.age" :min="0" :max="120" />
    </y-form-item>
  </y-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const cityOptions = computed(() => [
  { label: t('demo.common.beijing'), value: 'beijing' },
  { label: t('demo.common.shanghai'), value: 'shanghai' },
  { label: t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: t('demo.common.shenzhen'), value: 'shenzhen' },
])

const demoLayout = ref<'horizontal' | 'vertical' | 'inline'>('horizontal')

const layoutDemoForm = reactive({
  name: '',
  city: undefined as string | undefined,
  age: null as number | null,
})
</script>
