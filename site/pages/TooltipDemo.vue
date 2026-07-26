<template>
  <ComponentDocPage
    title-key="demo.tooltip.title"
    description-key="demo.tooltip.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/tooltip'
</script>
