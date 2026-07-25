<template>
  <Button @click="count++">{{ $t('demo.button.clickCount', { count }) }}</Button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button } from 'yiz-ui'

const count = ref(0)
</script>
