<template>
  <ComponentDocPage
    title-key="demo.nav.cascader"
    description-key="demo.cascader.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/cascader'
</script>
