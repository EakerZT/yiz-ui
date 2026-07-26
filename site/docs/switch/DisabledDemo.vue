<template>
  <y-button-group>
    <y-switch v-model:value="v2" disabled />
    <y-switch v-model:value="v3" disabled />
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v2 = ref(false)

const v3 = ref(true)
</script>
