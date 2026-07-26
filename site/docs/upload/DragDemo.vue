<template>
  <y-upload multiple accept=".png,.jpg,.jpeg,image/*" allow-drag @upload="onDragUpload">
    <div class="demo-upload-drop">
      <strong>{{ $t('demo.upload.dropTitle') }}</strong>
      <span>{{ $t('demo.upload.dropDesc') }}</span>
    </div>
  </y-upload>
  <p class="demo-upload-info">{{ dragFilesText }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const dragFiles = ref<File[]>([])

const dragFilesText = computed(() => formatFiles(dragFiles.value))

function onDragUpload(files: File[]) {
  dragFiles.value = files
}

function formatFiles(files: File[]) {
  if (files.length === 0) return $t('demo.upload.noFiles')
  return files.map((file) => file.name).join(', ')
}
</script>

<style scoped>
.demo-upload-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-upload-drop {
  width: 360px;
  max-width: 100%;
  min-height: 112px;
  box-sizing: border-box;
  border: 1px dashed var(--yiz-color-border);
  border-radius: 6px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.demo-upload-drop strong {
  color: #333;
}

.demo-upload-drop span {
  font-size: 13px;
}
</style>
