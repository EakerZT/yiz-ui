<template>
  <ComponentDocPage
    title-key="demo.nav.drawer"
    description-key="demo.drawer.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/drawer'
</script>
