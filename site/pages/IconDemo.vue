<template>
  <ComponentDocPage
    title-key="demo.nav.icon"
    description-key="demo.icon.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/icon'
</script>
