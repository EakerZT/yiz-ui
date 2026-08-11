<template>
  <div class="demo-radio-button-stack">
    <y-radio-button-group v-model:value="radioButtonSize" :options="sizeOptions" />
    <y-radio-button-group v-model:value="buttonSizeValue" :options="buttonOptions" :size="radioButtonSize" />
  </div>
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

const buttonSizeValue = ref('banana')

const radioButtonSize = ref<'small' | 'default' | 'large'>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-radio-button-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
