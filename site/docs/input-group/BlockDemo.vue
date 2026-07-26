<template>
  <y-input-group block before-addon="https://" after-addon=".com">
    <y-input v-model:value="blockDomain" :placeholder="$t('demo.inputGroup.domain')" style="flex: 1" />
    <y-button type="primary">{{ $t('demo.inputGroup.visit') }}</y-button>
  </y-input-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const blockDomain = ref('docs')
</script>
