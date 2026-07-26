<template>
  <y-pagination v-model:page="jumpPage" :total="500" show-total show-quick-jumper />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const jumpPage = ref(5)
</script>
