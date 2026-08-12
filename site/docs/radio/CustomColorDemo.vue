<template>
  <div class="demo-radio-button-stack">
    <y-radio-button-group v-model:value="buttonColor1" :options="buttonOptions" fill-color="#1677ff" />
    <y-radio-button-group v-model:value="buttonColor2">
      <y-radio-button value="day" fill-color="#faad14">{{ t('demo.radio.day') }}</y-radio-button>
      <y-radio-button value="week" fill-color="#ff4d4f">{{ t('demo.radio.week') }}</y-radio-button>
      <y-radio-button value="month" text-color="#ffeb3b" fill-color="#722ed1">
        {{ t('demo.radio.month') }}
      </y-radio-button>
    </y-radio-button-group>
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

const buttonColor1 = ref('apple')

const buttonColor2 = ref('week')
</script>

<style scoped>
.demo-radio-button-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
