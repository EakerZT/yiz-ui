<template>
  <ComponentDocPage
    title-key="demo.timeline.title"
    description-key="demo.timeline.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/timeline'
</script>
