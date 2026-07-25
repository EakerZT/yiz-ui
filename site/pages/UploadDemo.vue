<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.upload.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.upload.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-upload @upload="onBasicUpload">
        <y-button>{{ $t('demo.upload.selectFile') }}</y-button>
      </y-upload>
      <p class="demo-upload-info">{{ basicFilesText }}</p>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.upload.multipleImage')" style="margin-top: 8px">
      <y-upload multiple accept="image/*" @upload="onMultipleUpload">
        <y-button type="primary">{{ $t('demo.upload.selectImages') }}</y-button>
      </y-upload>
      <p class="demo-upload-info">{{ multipleFilesText }}</p>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.drag')" style="margin-top: 8px">
      <y-upload multiple accept=".png,.jpg,.jpeg,image/*" allow-drag @upload="onDragUpload">
        <div class="demo-upload-drop">
          <strong>{{ $t('demo.upload.dropTitle') }}</strong>
          <span>{{ $t('demo.upload.dropDesc') }}</span>
        </div>
      </y-upload>
      <p class="demo-upload-info">{{ dragFilesText }}</p>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'

const basicFiles = ref<File[]>([])
const multipleFiles = ref<File[]>([])
const dragFiles = ref<File[]>([])

const basicFilesText = computed(() => formatFiles(basicFiles.value))
const multipleFilesText = computed(() => formatFiles(multipleFiles.value))
const dragFilesText = computed(() => formatFiles(dragFiles.value))

function onBasicUpload(files: File[]) {
  basicFiles.value = files
}

function onMultipleUpload(files: File[]) {
  multipleFiles.value = files
}

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
