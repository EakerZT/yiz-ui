<template>
  <y-input-number v-model:value="v7" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v7 = ref<number | null>(0)
</script>
