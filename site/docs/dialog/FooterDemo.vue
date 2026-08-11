<template>
  <y-button-group>
    <y-button type="primary" @click="customVisible = true">{{ t('demo.dialog.customFooter') }}</y-button>
    <y-button @click="disabledVisible = true">{{ t('demo.dialog.disabledFooter') }}</y-button>
  </y-button-group>

  <y-dialog v-model:show="customVisible" :title="t('demo.card.confirmAction')">
    <p>{{ t('demo.card.confirmMsg') }}</p>
    <template #footer>
      <div class="dialog-footer-actions">
        <y-button @click="customVisible = false">{{ t('demo.common.cancel') }}</y-button>
        <y-button type="primary" @click="customVisible = false">{{ t('demo.common.confirm') }}</y-button>
      </div>
    </template>
  </y-dialog>

  <y-dialog v-model:show="disabledVisible" :title="t('demo.dialog.disabledFooter')" disabled-footer>
    <p>{{ t('demo.dialog.disabledFooterHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const customVisible = ref(false)
const disabledVisible = ref(false)
</script>

<style scoped>
.dialog-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
