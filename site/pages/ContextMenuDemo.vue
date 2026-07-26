<template>
  <ComponentDocPage
    title-key="demo.contextMenu.title"
    description-key="demo.contextMenu.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/context-menu'
</script>
