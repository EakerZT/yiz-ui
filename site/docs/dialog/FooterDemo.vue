<template>
  <ButtonGroup>
    <Button type="primary" @click="customVisible = true">{{ $t('demo.dialog.customFooter') }}</Button>
    <Button @click="disabledVisible = true">{{ $t('demo.dialog.disabledFooter') }}</Button>
  </ButtonGroup>

  <Dialog v-model:show="customVisible" :title="$t('demo.card.confirmAction')">
    <p>{{ $t('demo.card.confirmMsg') }}</p>
    <template #footer>
      <div class="dialog-footer-actions">
        <Button @click="customVisible = false">{{ $t('demo.common.cancel') }}</Button>
        <Button type="primary" @click="customVisible = false">{{ $t('demo.common.confirm') }}</Button>
      </div>
    </template>
  </Dialog>

  <Dialog v-model:show="disabledVisible" :title="$t('demo.dialog.disabledFooter')" disabled-footer>
    <p>{{ $t('demo.dialog.disabledFooterHint') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, ButtonGroup, Dialog } from 'yiz-ui'

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
