<template>
  <y-button-group>
    <y-switch v-model:value="v6" color="#67c23a" />
    <y-switch v-model:value="v7" color="#ff4d4f" />
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v6 = ref(true)

const v7 = ref(true)
</script>
