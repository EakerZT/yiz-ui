<template>
  <Button @click="visible = true">{{ $t('demo.common.customTitle') }}</Button>
  <Dialog v-model:show="visible">
    <template #title>
      <span class="custom-title">{{ $t('demo.common.customTitleColor') }}</span>
    </template>
    <p>{{ $t('demo.dialog.customTitleHint') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>

<style scoped>
.custom-title {
  color: var(--yiz-color-primary);
}
</style>
