<template>
  <ComponentDocPage
    title-key="demo.carousel.title"
    description-key="demo.carousel.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/carousel'
</script>
