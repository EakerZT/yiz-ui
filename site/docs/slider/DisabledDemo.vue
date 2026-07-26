<template>
  <div class="demo-slider-stack">
    <y-slider v-model:value="disabledValue" disabled />
    <y-slider v-model:value="disabledRangeValue" range disabled />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const disabledValue = ref(50)

const disabledRangeValue = ref<[number, number]>([25, 75])
</script>

<style>
.demo-slider-stack {
  display: grid;
  max-width: 520px;
  gap: 16px;
}
</style>
