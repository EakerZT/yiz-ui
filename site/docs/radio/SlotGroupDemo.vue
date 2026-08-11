<template>
  <y-radio-group v-model:value="group4">
    <y-radio value="apple">{{ t('demo.radio.apple') }}</y-radio>
    <y-radio value="banana">
      <span style="color: var(--yiz-color-primary)">{{ t('demo.radio.banana') }}</span>
    </y-radio>
    <y-radio value="orange" disabled>{{ t('demo.radio.orange') }}</y-radio> </y-radio-group
  ><span class="demo-hint">{{ group4 }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const group4 = ref('banana')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
