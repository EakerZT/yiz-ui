<template>
  <y-button @click="count++">{{ t('demo.button.clickCount', { count }) }}</y-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const count = ref(0)
</script>
