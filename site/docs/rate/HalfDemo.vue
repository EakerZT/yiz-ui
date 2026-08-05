<template>
  <y-rate v-model:value="value" allow-half show-score score-template="{value} / {total}" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(3.5)
</script>
