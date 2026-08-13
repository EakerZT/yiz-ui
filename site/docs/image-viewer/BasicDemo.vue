<template>
  <div class="demo-image-viewer-gallery">
    <button
      v-for="(item, index) in images"
      :key="item.url"
      class="demo-image-viewer-thumbnail"
      type="button"
      @click="show(index)"
    >
      <img :src="item.url" :alt="item.filename" />
      <span>{{ item.filename }}</span>
    </button>
  </div>

  <div class="demo-image-viewer-options">
    <label>
      <Switch v-model:value="download" size="small" />
      {{ t('demo.imageViewer.download') }}
    </label>
    <label>
      <Switch v-model:value="maskClosable" size="small" />
      {{ t('demo.imageViewer.maskClosable') }}
    </label>
    <label>
      <Switch v-model:value="loop" size="small" />
      {{ t('demo.imageViewer.loop') }}
    </label>
    <label>
      <Switch v-model:value="toolbar" size="small" />
      {{ t('demo.imageViewer.toolbar') }}
    </label>
    <label>
      <Switch v-model:value="navbar" size="small" />
      {{ t('demo.imageViewer.navbar') }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Switch, useImageViewer, type ImageViewerItem } from 'yiz-ui'
import coastUrl from '../../assets/image-viewer-coast.svg'
import forestRoadUrl from '../../assets/image-viewer-forest-road.svg'
import mountainLakeUrl from '../../assets/image-viewer-mountain-lake.svg'
import { useLocale } from '../../i18n'

const t = useLocale()
const viewer = useImageViewer()
const download = ref(true)
const maskClosable = ref(false)
const loop = ref(true)
const toolbar = ref(true)
const navbar = ref(true)

const images: ImageViewerItem[] = [
  { filename: 'mountain-lake.svg', url: mountainLakeUrl },
  { filename: 'forest-road.svg', url: forestRoadUrl },
  { filename: 'coast.svg', url: coastUrl },
]

function show(initialIndex: number) {
  viewer.show(images, {
    initialIndex,
    download: download.value,
    maskClosable: maskClosable.value,
    loop: loop.value,
    toolbar: toolbar.value,
    navbar: navbar.value,
  })
}
</script>

<style scoped>
.demo-image-viewer-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.demo-image-viewer-thumbnail {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--yiz-color-border);
  border-radius: var(--yiz-radius-large);
  color: var(--yiz-color-text-secondary);
  background: var(--yiz-color-bg-elevated);
  cursor: pointer;
  text-align: left;
  transition:
    border-color var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard),
    box-shadow var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard);
}

.demo-image-viewer-thumbnail:hover {
  border-color: var(--yiz-color-primary);
  box-shadow: var(--yiz-shadow-small);
}

.demo-image-viewer-thumbnail:focus-visible {
  outline: 2px solid var(--yiz-color-primary);
  outline-offset: 2px;
}

.demo-image-viewer-thumbnail img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.demo-image-viewer-thumbnail span {
  display: block;
  overflow: hidden;
  padding: 8px 10px;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-image-viewer-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-top: 16px;
}

.demo-image-viewer-options label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--yiz-color-text-secondary);
  font-size: 13px;
}

@media (max-width: 720px) {
  .demo-image-viewer-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
