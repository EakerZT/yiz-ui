<template>
  <ComponentDocPage
    title-key="demo.colorPicker.title"
    description-key="demo.colorPicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/color-picker'
</script>
