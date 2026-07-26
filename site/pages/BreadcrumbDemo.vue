<template>
  <ComponentDocPage
    title-key="demo.breadcrumb.title"
    description-key="demo.breadcrumb.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/breadcrumb'
</script>
