<template>
  <ComponentDocPage
    title-key="demo.datePicker.title"
    description-key="demo.datePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/date-picker'
</script>
