<template>
  <y-upload @upload="onBasicUpload">
    <y-button>{{ $t('demo.upload.selectFile') }}</y-button>
  </y-upload>
  <p class="demo-upload-info">{{ basicFilesText }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const basicFiles = ref<File[]>([])

const basicFilesText = computed(() => formatFiles(basicFiles.value))

function onBasicUpload(files: File[]) {
  basicFiles.value = files
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
