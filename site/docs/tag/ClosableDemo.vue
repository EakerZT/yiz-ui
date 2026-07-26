<template>
  <y-button-group>
    <y-tag v-for="tag in tags" :key="tag.id" closable @close="handleClose(tag.id)">
      {{ $t(tag.labelKey, tag.index ? { index: tag.index } : undefined) }}
    </y-tag>
  </y-button-group>
  <div style="margin-top: 8px">
    <y-button size="small" @click="addTag">{{ $t('demo.tag.addTag') }}</y-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

interface DemoTag {
  id: number
  labelKey: string
  index?: number
}

const tags = ref<DemoTag[]>([
  { id: 1, labelKey: 'demo.tab.tab1' },
  { id: 2, labelKey: 'demo.tab.tab2' },
  { id: 3, labelKey: 'demo.tab.tab3' },
  { id: 4, labelKey: 'demo.tag.tag4' },
])
let nextTagId = 5

function handleClose(id: number) {
  tags.value = tags.value.filter((tag) => tag.id !== id)
}

function addTag() {
  const id = nextTagId++
  tags.value.push({ id, labelKey: 'demo.tag.tagN', index: id })
}
</script>
