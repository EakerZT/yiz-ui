<template>
  <ComponentDocPage
    title-key="demo.loadingBar.title"
    description-key="demo.loadingBar.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/loading-bar'
</script>
