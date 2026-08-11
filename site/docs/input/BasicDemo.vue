<template>
  <y-input v-model:value="inputText" :placeholder="t('demo.common.pleaseInput')" /><span class="demo-hint">{{
    t('demo.input.currentValue', { value: inputText || t('demo.common.empty') })
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const inputText = ref('')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
