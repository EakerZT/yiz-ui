<template>
  <ComponentDocPage
    title-key="demo.nav.dateRangePicker"
    description-key="demo.dateRangePicker.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/date-range-picker'
</script>
