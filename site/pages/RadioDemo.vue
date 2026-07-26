<template>
  <ComponentDocPage
    title-key="demo.radio.title"
    description-key="demo.radio.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/radio'
</script>
