<template>
  <ComponentDocPage
    title-key="demo.nav.notification"
    description-key="demo.notification.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/notification'
</script>
