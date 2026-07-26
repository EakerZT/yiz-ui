<template>
  <y-color-picker v-model:value="affixColor" prefix="HEX" suffix="Theme" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const affixColor = ref('#722ed1')
</script>
