<template>
  <div class="demo-pagination-size-list">
    <y-radio-button-group v-model:value="paginationSize" :options="sizeOptions" />
    <y-pagination
      v-model:page="sizeDemoPage"
      :total="180"
      :size="paginationSize"
      show-total
      show-size-changer
      show-quick-jumper
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const sizeDemoPage = ref(3)

const paginationSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-pagination-size-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
