<template>
  <div class="demo-tag-mode-panel">
    <div v-for="mode in tagModes" :key="mode" class="demo-tag-mode-row">
      <span class="demo-tag-mode-label">{{ mode }}</span>
      <y-button-group>
        <y-tag v-for="preset in tagPresets" :key="preset.color" :mode="mode" :color="preset.color">
          {{ preset.label }}
        </y-tag>
      </y-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type TagMode } from 'yiz-ui'

const tagModes: TagMode[] = ['filled', 'solid', 'outlined']

const tagPresets = [
  { label: 'default', color: 'default' },
  { label: 'primary', color: 'primary' },
  { label: 'success', color: 'success' },
  { label: 'warning', color: 'warning' },
  { label: 'error', color: 'error' },
]
</script>

<style scoped>
.demo-tag-mode-panel,
.demo-tag-mode-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.demo-tag-mode-panel {
  gap: 16px;
}

.demo-tag-mode-label {
  color: #666;
  font-size: 13px;
}
</style>
