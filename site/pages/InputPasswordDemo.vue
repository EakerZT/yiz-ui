<template>
  <ComponentDocPage
    title-key="demo.inputPassword.title"
    description-key="demo.inputPassword.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/input-password'
</script>
