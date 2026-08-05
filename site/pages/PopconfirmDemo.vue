<template>
  <ComponentDocPage
    title-key="demo.popconfirm.title"
    description-key="demo.popconfirm.desc"
    :demos="demos"
    :api-components="apiComponents"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import { apiComponents, demos } from '../docs/popconfirm'
</script>
