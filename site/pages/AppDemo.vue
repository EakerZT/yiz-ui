<template>
  <ComponentDocPage
    title-key="demo.nav.app"
    description-key="demo.app.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/app'
</script>
