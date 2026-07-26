<template>
  <y-date-picker v-model:value="value3" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value3 = ref<Date | null>(new Date())
</script>
