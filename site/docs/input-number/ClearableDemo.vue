<template>
  <y-input-number v-model:value="value" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref<number | null>(88)
</script>
