<template>
  <ComponentDocPage
    title-key="demo.nav.loading"
    description-key="demo.loading.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/loading'
</script>
