<template>
  <ComponentDocPage
    title-key="demo.datetimeRangePicker.title"
    description-key="demo.datetimeRangePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/date-time-range-picker'
</script>
