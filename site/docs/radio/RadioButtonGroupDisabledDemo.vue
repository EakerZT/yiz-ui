<template>
  <y-radio-button-group v-model:value="buttonGroup3" :options="buttonOptionsWithDisabled" /><y-radio-button-group
    v-model:value="buttonGroup4"
    :options="buttonOptions"
    disabled
    style="margin-left: 12px"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const buttonOptions = computed(() => [
  { label: t('demo.radio.apple'), value: 'apple' },
  { label: t('demo.radio.banana'), value: 'banana' },
  { label: t('demo.radio.orange'), value: 'orange' },
])

const buttonOptionsWithDisabled = computed(() => [
  { label: t('demo.radio.apple'), value: 'apple' },
  { label: t('demo.radio.banana'), value: 'banana', disabled: true },
  { label: t('demo.radio.orange'), value: 'orange' },
])

const buttonGroup3 = ref('orange')

const buttonGroup4 = ref('banana')
</script>
