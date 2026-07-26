<template>
  <y-radio-group v-model:value="group1" :options="groupOptions" direction="horizontal" /><span class="demo-hint">{{
    group1
  }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const groupOptions = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana' },
  { label: $t('demo.radio.orange'), value: 'orange' },
])

const group1 = ref('apple')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
