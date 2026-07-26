<template>
  <ComponentDocPage
    title-key="demo.menu.title"
    description-key="demo.menu.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/menu'
</script>
