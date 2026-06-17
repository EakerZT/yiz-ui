<template>
  <y-table :data="$props.value" bordered no>
    <slot></slot>
  </y-table>
</template>

<script lang="ts" setup>
defineProps<{
  value: Record<string, any>[]
}>()
</script>
