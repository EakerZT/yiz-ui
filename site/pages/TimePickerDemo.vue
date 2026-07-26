<template>
  <ComponentDocPage
    title-key="demo.timePicker.title"
    description-key="demo.timePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/time-picker'
</script>
