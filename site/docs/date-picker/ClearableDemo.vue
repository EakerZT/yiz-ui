<template>
  <y-date-picker v-model:value="value2" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value2 = ref<Date | null>(new Date())
</script>
