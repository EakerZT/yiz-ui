<template>
  <y-checkbox-group v-model:value="group1" :options="groupOptions" direction="horizontal" /><span class="demo-hint">{{
    group1
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group1 = ref<string[]>([])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
