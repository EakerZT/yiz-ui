<template>
  <y-checkbox-group v-model:value="group2" :options="groupOptions" direction="vertical" /><span class="demo-hint">{{
    group2
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group2 = ref(['apple', 'orange'])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
