<template>
  <y-time-picker v-model:value="value6" :format="'HH:mm'" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value6 = ref<string | null>('10:00')
</script>
