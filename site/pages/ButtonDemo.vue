<template>
  <ComponentDocPage
    title-key="demo.nav.button"
    description-key="demo.button.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/button'
</script>
