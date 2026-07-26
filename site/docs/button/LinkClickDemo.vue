<template>
  <y-link-button @click="count++">{{ $t('demo.button.clickCount', { count }) }}</y-link-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const count = ref(0)
</script>
