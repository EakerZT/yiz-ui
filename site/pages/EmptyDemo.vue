<template>
  <ComponentDocPage
    title-key="demo.nav.empty"
    description-key="demo.empty.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/empty'
</script>
