<template>
  <ComponentDocPage
    title-key="demo.segmented.title"
    description-key="demo.segmented.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/segmented'
</script>
