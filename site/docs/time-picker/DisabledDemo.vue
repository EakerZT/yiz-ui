<template>
  <y-time-picker v-model:value="value4" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value4 = ref<string | null>('08:00:00')
</script>
