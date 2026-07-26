<template>
  <y-date-picker v-model:value="value5" :disabled-date="disabledDate" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value5 = ref<Date | null>(null)

function disabledDate(d: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() < today.getTime()
}
</script>
