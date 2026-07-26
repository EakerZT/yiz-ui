<template>
  <ComponentDocPage
    title-key="demo.descriptions.title"
    description-key="demo.descriptions.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/descriptions'
</script>
