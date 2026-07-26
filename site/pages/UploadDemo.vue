<template>
  <ComponentDocPage
    title-key="demo.upload.title"
    description-key="demo.upload.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/upload'
</script>
