<template>
  <y-checkbox-group v-model:value="group4" :options="groupOptions" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group4 = ref(['banana'])
</script>
