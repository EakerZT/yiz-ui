<template>
  <y-button-group>
    <y-tag color="#f50">#f50</y-tag>
    <y-tag color="#2db7f5">#2db7f5</y-tag>
    <y-tag color="#87d068">#87d068</y-tag>
    <y-tag color="#108ee9">#108ee9</y-tag>
    <y-tag color="#f50" closable>{{ t('demo.common.closable') }}</y-tag>
    <y-tag mode="solid" color="#1677ff">#1677ff</y-tag>
    <y-tag mode="solid" color="#fadb14">#fadb14</y-tag>
    <y-tag mode="solid" color="#1677ff" text-color="#ffeb3b">textColor</y-tag>
  </y-button-group>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
