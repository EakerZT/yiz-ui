<template>
  <ComponentDocPage
    title-key="demo.rate.title"
    description-key="demo.rate.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/rate'
</script>
