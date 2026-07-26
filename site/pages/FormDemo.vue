<template>
  <ComponentDocPage
    title-key="demo.nav.form"
    description-key="demo.form.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/form'
</script>
