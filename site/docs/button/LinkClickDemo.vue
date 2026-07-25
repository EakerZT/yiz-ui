<template>
  <LinkButton @click="count++">{{ $t('demo.button.clickCount', { count }) }}</LinkButton>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, LinkButton } from 'yiz-ui'

const count = ref(0)
</script>
