<template>
  <ComponentDocPage
    title-key="demo.info.title"
    description-key="demo.info.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/info'
</script>
