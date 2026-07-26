<template>
  <ComponentDocPage
    title-key="demo.dropmenu.title"
    description-key="demo.dropmenu.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/dropmenu'
</script>
