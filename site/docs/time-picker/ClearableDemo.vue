<template>
  <y-time-picker v-model:value="value2" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value2 = ref<string | null>('14:30:00')
</script>
