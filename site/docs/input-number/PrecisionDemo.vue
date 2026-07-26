<template>
  <y-input-number v-model:value="v4" :step="0.1" :precision="1" /><span class="demo-hint">{{
    $t('demo.inputNumber.currentValue', { value: v4 ?? '' })
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v4 = ref<number | null>(0)
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
