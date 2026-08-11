<template>
  <y-segmented v-model:value="renderValue" :options="statusOptions">
    <template #render="{ option, selected }">
      <span class="demo-segmented-render" :class="{ 'demo-segmented-render-selected': selected }">
        <span class="demo-segmented-dot" />
        {{ option.label }}
      </span>
    </template>
  </y-segmented>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const statusOptions = computed(() => [
  { label: t('demo.segmented.processing'), value: 'processing' },
  { label: t('demo.segmented.done'), value: 'done' },
  { label: t('demo.segmented.failed'), value: 'failed' },
])

const renderValue = ref('processing')
</script>

<style scoped>
.demo-segmented-render {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.demo-segmented-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfbfbf;
}

.demo-segmented-render-selected .demo-segmented-dot {
  background: var(--yiz-color-primary);
}
</style>
