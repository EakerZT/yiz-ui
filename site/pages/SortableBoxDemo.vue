<template>
  <ComponentDocPage
    title-key="demo.sortableBox.title"
    description-key="demo.sortableBox.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/sortable-box'
</script>
