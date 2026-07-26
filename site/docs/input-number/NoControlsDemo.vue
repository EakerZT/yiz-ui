<template>
  <y-button-group>
    <y-input-number v-model:value="v8" :controls="false" />
    <y-input-number v-model:value="v8" :controls="false" align="center" />
    <y-input-number v-model:value="v8" :controls="false" align="right" />
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v8 = ref<number | null>(0)
</script>
