<template>
  <ComponentDocPage
    title-key="demo.collapse.title"
    description-key="demo.collapse.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/collapse'
</script>
