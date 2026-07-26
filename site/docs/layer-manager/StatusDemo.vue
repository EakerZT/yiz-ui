<template>
  <div class="layer-status-grid">
    <div class="layer-status-item">
      <span>{{ $t('demo.layerManager.isTopLayer') }}</span>
      <strong :class="{ inactive: !layer.isTopLayer.value }">
        {{ layer.isTopLayer.value ? $t('demo.layerManager.top') : $t('demo.layerManager.notTop') }}
      </strong>
    </div>
    <div class="layer-status-item">
      <span>{{ $t('demo.layerManager.count') }}</span>
      <strong>{{ layer.count.value }}</strong>
    </div>
    <div class="layer-status-item">
      <span>{{ $t('demo.layerManager.index') }}</span>
      <strong>{{ layer.index.value }}</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $t, useModalLayer } from 'yiz-ui'

const layer = useModalLayer()

layer.active()
</script>

<style scoped>
.layer-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.layer-status-item {
  min-height: 72px;
  padding: 12px;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  background: #f8fafc;
}

.layer-status-item span {
  display: block;
  color: #888;
  font-size: 13px;
  line-height: 20px;
}

.layer-status-item strong {
  display: block;
  margin-top: 6px;
  color: var(--yiz-color-primary);
  font-size: 20px;
  line-height: 28px;
}

.layer-status-item strong.inactive {
  color: var(--yiz-color-warning);
}
</style>
