<template>
  <y-button @click="visible9 = true">{{ $t('demo.common.customTitle') }}</y-button>

  <y-drawer v-model:show="visible9">
    <template #title>
      <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customTitleColor') }}</span>
    </template>
    <p>{{ $t('demo.dialog.customTitleHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible9 = ref(false)
</script>
