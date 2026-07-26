<template>
  <div class="button-size-demo">
    <y-radio-button-group v-model:value="size" :options="sizeOptions" />
    <y-button-group wrap gap="8">
      <y-button :size="size">outlined</y-button>
      <y-button type="primary" :size="size">primary</y-button>
      <y-button type="dash" :size="size">dash</y-button>
      <y-button type="filled" :size="size">filled</y-button>
      <y-button type="text" :size="size">text</y-button>
      <y-button type="plain" :size="size">plain</y-button>
      <y-button type="primary" color="success" :size="size">success</y-button>
      <y-button type="primary" color="warning" :size="size">warning</y-button>
      <y-button type="primary" color="error" :size="size">error</y-button>
      <y-button type="primary" :size="size"><y-icon size="16" :icon="Flash16Regular" /></y-button>
      <y-button type="primary" :size="size"><y-icon size="16" :icon="Flash16Regular" /> Search</y-button>
      <y-button type="primary" shape="round" :size="size">round</y-button>
      <y-button type="primary" shape="round" :size="size"><y-icon size="16" :icon="Flash16Regular" /></y-button>
      <y-button type="primary" shape="circle" :size="size"><y-icon size="16" :icon="Flash16Regular" /></y-button>
    </y-button-group>
  </div>
</template>

<script lang="ts" setup>
import { Flash16Regular } from '@vicons/fluent'
import { ref } from 'vue'

const size = ref<'small' | 'default' | 'large'>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.button-size-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
