<template>
  <ComponentDocPage
    title-key="demo.nav.message"
    description-key="demo.message.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/message'
</script>
