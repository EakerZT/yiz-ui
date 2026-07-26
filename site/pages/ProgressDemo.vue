<template>
  <ComponentDocPage
    title-key="demo.nav.progress"
    description-key="demo.progress.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/progress'
</script>
