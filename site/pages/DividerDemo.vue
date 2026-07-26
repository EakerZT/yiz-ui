<template>
  <ComponentDocPage
    title-key="demo.divider.title"
    description-key="demo.divider.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/divider'
</script>
