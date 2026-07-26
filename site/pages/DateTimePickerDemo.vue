<template>
  <ComponentDocPage
    title-key="demo.datetimePicker.title"
    description-key="demo.datetimePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/date-time-picker'
</script>
