<template>
  <ComponentDocPage
    title-key="demo.nav.select"
    description-key="demo.select.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/select'
</script>
