<template></template>

<script lang="ts" setup>
defineProps<{
  label?: string
  value?: any
  disabled?: boolean
  item?: { label: string; value: any; disabled?: boolean; [key: string]: any }
}>()
</script>
