<template>
  <ComponentDocPage
    title-key="demo.nav.tab"
    description-key="demo.tab.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/tab'
</script>
