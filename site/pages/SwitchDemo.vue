<template>
  <ComponentDocPage
    title-key="demo.nav.switch"
    description-key="demo.switch.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/switch'
</script>
