<template>
  <ComponentDocPage
    title-key="demo.checkbox.title"
    description-key="demo.checkbox.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/checkbox'
</script>
