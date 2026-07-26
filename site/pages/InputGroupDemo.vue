<template>
  <ComponentDocPage
    title-key="demo.inputGroup.title"
    description-key="demo.inputGroup.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/input-group'
</script>
