<template>
  <ComponentDocPage
    title-key="demo.inputCustom.title"
    description-key="demo.inputCustom.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/input-custom'
</script>
