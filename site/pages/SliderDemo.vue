<template>
  <ComponentDocPage
    title-key="demo.slider.title"
    description-key="demo.slider.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/slider'
</script>
