<template>
  <ComponentDocPage
    title-key="demo.nav.card"
    description-key="demo.card.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/card'
</script>
