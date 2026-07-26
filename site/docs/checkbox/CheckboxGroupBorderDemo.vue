<template>
  <y-checkbox-group v-model:value="borderGroup" :options="groupOptions" border /><span class="demo-hint">{{
    borderGroup
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const borderGroup = ref(['banana'])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
