<template>
  <y-input-group before-addon="https://" after-addon=".com">
    <y-input v-model:value="domain" :placeholder="t('demo.inputGroup.domain')" />
  </y-input-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const domain = ref('yiz-ui')
</script>
