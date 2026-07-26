<template>
  <ComponentDocPage
    title-key="demo.nav.textarea"
    description-key="demo.textarea.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/textarea'
</script>
