<template>
  <Button type="primary" @click="visible = true">{{ $t('demo.dialog.openDialog') }}</Button>
  <Dialog v-model:show="visible" :title="$t('demo.dialog.basicDialog')">
    <p>{{ $t('demo.dialog.basicContent') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>
