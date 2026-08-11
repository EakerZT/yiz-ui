<template>
  <y-radio-button-group v-model:value="buttonRender" :options="buttonOptions">
    <template #render="{ label, selected }">
      <span class="demo-radio-button-render" :class="{ 'demo-radio-button-render-selected': selected }">
        <span class="demo-radio-button-dot" />
        {{ label }}
      </span>
    </template>
  </y-radio-button-group>
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

const buttonRender = ref('banana')
</script>

<style scoped>
.demo-radio-button-render {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.demo-radio-button-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfbfbf;
}

.demo-radio-button-render-selected .demo-radio-button-dot {
  background: currentColor;
}
</style>
