<template>
  <y-pagination v-model:page="simplePage" :total="320" simple />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const simplePage = ref(8)
</script>
