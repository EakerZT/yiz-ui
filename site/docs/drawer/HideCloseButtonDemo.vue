<template>
  <y-button @click="visible5 = true">{{ $t('demo.common.hideCloseButton') }}</y-button>

  <y-drawer v-model:show="visible5" :title="$t('demo.common.noCloseButton')" :closable="false">
    <p>{{ $t('demo.drawer.noCloseHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible5 = ref(false)
</script>
