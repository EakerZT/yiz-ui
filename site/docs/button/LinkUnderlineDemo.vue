<template>
  <y-link-button underline>{{ t('demo.button.linkUnderlineHint') }}</y-link-button>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
