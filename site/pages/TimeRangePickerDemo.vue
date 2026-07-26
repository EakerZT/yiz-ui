<template>
  <ComponentDocPage
    title-key="demo.timeRangePicker.title"
    description-key="demo.timeRangePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/time-range-picker'
</script>
