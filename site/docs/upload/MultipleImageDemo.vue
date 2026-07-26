<template>
  <y-upload multiple accept="image/*" @upload="onMultipleUpload">
    <y-button type="primary">{{ $t('demo.upload.selectImages') }}</y-button>
  </y-upload>
  <p class="demo-upload-info">{{ multipleFilesText }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const multipleFiles = ref<File[]>([])

const multipleFilesText = computed(() => formatFiles(multipleFiles.value))

function onMultipleUpload(files: File[]) {
  multipleFiles.value = files
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
</style>
