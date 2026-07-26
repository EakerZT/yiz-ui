<template>
  <y-radio-button-group v-model:value="buttonGroup1" :options="buttonOptions" /><span class="demo-hint">{{
    buttonGroup1
  }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const buttonOptions = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana' },
  { label: $t('demo.radio.orange'), value: 'orange' },
])

const buttonGroup1 = ref('apple')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
