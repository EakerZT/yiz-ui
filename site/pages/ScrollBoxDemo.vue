<template>
  <ComponentDocPage
    title-key="demo.nav.scrollBox"
    description-key="demo.scrollBox.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/scroll-box'
</script>
