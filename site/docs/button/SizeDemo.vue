<template>
  <div class="button-size-demo">
    <RadioButtonGroup v-model:value="size" :options="sizeOptions" />
    <ButtonGroup wrap gap="8">
      <Button :size="size">outlined</Button>
      <Button type="primary" :size="size">primary</Button>
      <Button type="dash" :size="size">dash</Button>
      <Button type="filled" :size="size">filled</Button>
      <Button type="text" :size="size">text</Button>
      <Button type="plain" :size="size">plain</Button>
      <Button type="primary" color="success" :size="size">success</Button>
      <Button type="primary" color="warning" :size="size">warning</Button>
      <Button type="primary" color="error" :size="size">error</Button>
      <Button type="primary" :size="size"><Icon size="16" :icon="Flash16Regular" /></Button>
      <Button type="primary" :size="size"><Icon size="16" :icon="Flash16Regular" /> Search</Button>
      <Button type="primary" shape="round" :size="size">round</Button>
      <Button type="primary" shape="round" :size="size"><Icon size="16" :icon="Flash16Regular" /></Button>
      <Button type="primary" shape="circle" :size="size"><Icon size="16" :icon="Flash16Regular" /></Button>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash16Regular } from '@vicons/fluent'
import { Button, ButtonGroup, Icon, RadioButtonGroup } from 'yiz-ui'

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
