<template>
  <ComponentDocPage
    title-key="demo.popover.title"
    description-key="demo.popover.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/popover'
</script>
