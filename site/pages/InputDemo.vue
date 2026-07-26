<template>
  <ComponentDocPage
    title-key="demo.nav.input"
    description-key="demo.input.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/input'
</script>
