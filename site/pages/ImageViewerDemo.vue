<template>
  <ComponentDocPage
    title-key="demo.imageViewer.title"
    description-key="demo.imageViewer.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/image-viewer'
</script>
