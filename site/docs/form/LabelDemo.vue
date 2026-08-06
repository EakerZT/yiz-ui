<template>
  <div style="margin-bottom: 12px">
    <y-radio-button-group v-model:value="labelAlign" size="small">
      <y-radio-button value="left">{{ $t('demo.form.alignLeft') }}</y-radio-button>
      <y-radio-button value="center">{{ $t('demo.form.alignCenter') }}</y-radio-button>
      <y-radio-button value="right">{{ $t('demo.form.alignRight') }}</y-radio-button>
    </y-radio-button-group>
  </div>
  <y-form :model="labelForm" :label-align="labelAlign" :label-width="120" label-overflow>
    <y-form-item :label="$t('demo.common.name')" prop="name">
      <y-input v-model:value="labelForm.name" :placeholder="$t('demo.form.namePlaceholder')" />
    </y-form-item>
    <y-form-item :label="$t('demo.form.longLabel')" prop="city" :tooltip="$t('demo.form.nameTooltip')">
      <y-input v-model:value="labelForm.city" :placeholder="$t('demo.form.cityPlaceholder')" />
    </y-form-item>
    <y-form-item :label="$t('demo.form.longLabel')" prop="address">
      <y-input v-model:value="labelForm.address" :placeholder="$t('demo.form.cityPlaceholder')" />
    </y-form-item>
  </y-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { $t, type FormLabelAlign } from 'yiz-ui'

const labelAlign = ref<FormLabelAlign>('left')
const labelForm = reactive({
  name: '',
  city: '',
  address: '',
})
</script>
