<template>
  <y-input-number v-model:value="v3" :min="0" :max="100" /><span class="demo-hint">{{
    $t('demo.inputNumber.rangeValue', { value: v3 ?? '' })
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v3 = ref<number | null>(0)
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
