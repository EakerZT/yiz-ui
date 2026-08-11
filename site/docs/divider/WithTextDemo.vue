<template>
  <y-divider>{{ t('demo.divider.centerText') }}</y-divider
  ><y-divider text-placement="left">{{ t('demo.divider.leftText') }}</y-divider
  ><y-divider text-placement="right">{{ t('demo.divider.rightText') }}</y-divider>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
