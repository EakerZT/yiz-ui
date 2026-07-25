<template>
  <ButtonGroup>
    <Button @click="wideVisible = true">width="600px"</Button>
    <Button @click="narrowVisible = true">width="300px"</Button>
  </ButtonGroup>

  <Dialog v-model:show="wideVisible" :title="$t('demo.dialog.wideDialog')" width="600px">
    <p>{{ $t('demo.dialog.wideDialogHint') }}</p>
  </Dialog>
  <Dialog v-model:show="narrowVisible" :title="$t('demo.dialog.narrowDialog')" width="300px">
    <p>{{ $t('demo.dialog.narrowDialogHint') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, ButtonGroup, Dialog } from 'yiz-ui'

const wideVisible = ref(false)
const narrowVisible = ref(false)
</script>
