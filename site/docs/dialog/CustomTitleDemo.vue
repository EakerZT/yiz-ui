<template>
  <y-button @click="visible = true">{{ t('demo.common.customTitle') }}</y-button>
  <y-dialog v-model:show="visible">
    <template #title>
      <span class="custom-title">{{ t('demo.common.customTitleColor') }}</span>
    </template>
    <p>{{ t('demo.dialog.customTitleHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
</script>

<style scoped>
.custom-title {
  color: var(--yiz-color-primary);
}
</style>
