<template>
  <ComponentDocPage
    title-key="demo.layerManager.title"
    description-key="demo.layerManager.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/layer-manager'
</script>
