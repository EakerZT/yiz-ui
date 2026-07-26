<template>
  <y-switch v-model:value="v8" loading />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v8 = ref(true)
</script>
