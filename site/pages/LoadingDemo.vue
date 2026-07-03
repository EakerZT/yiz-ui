<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.loading') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.loading.desc') }}</p>

    <y-card :title="$t('demo.loading.indicatorType')" style="margin-top: 8px">
      <y-button-group>
        <span class="demo-loading-item">
          <y-loading />
          <em>ring</em>
        </span>
        <span class="demo-loading-item">
          <y-loading indicator="spin" />
          <em>spin</em>
        </span>
        <span class="demo-loading-item">
          <y-loading indicator="think" />
          <em>think</em>
        </span>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-loading-size-panel">
        <y-radio-button-group v-model:value="loadingSize" :options="sizeOptions" />
        <span class="demo-loading-item">
          <y-loading :size="loadingSize" />
          <em>{{ loadingSize }}</em>
        </span>
      </div>
    </y-card>

    <y-card :title="$t('demo.loading.tipText')" style="margin-top: 8px">
      <y-loading tip="Loading..." />
    </y-card>

    <y-card :title="$t('demo.loading.containerMode')" style="margin-top: 8px">
      <y-loading :loading="containerLoading">
        <div class="demo-loading-content">
          <p>{{ $t('demo.loading.wrappedContent') }}</p>
          <p>{{ $t('demo.loading.wrappedHint') }}</p>
        </div>
      </y-loading>
      <div style="margin-top: 8px">
        <y-button size="small" @click="containerLoading = !containerLoading">
          {{ containerLoading ? $t('demo.loading.stopLoading') : $t('demo.loading.startLoading') }}
        </y-button>
      </div>
    </y-card>

    <y-card :title="$t('demo.loading.delayShow')" style="margin-top: 8px">
      <y-loading :loading="delayLoading" :delay="500" :tip="$t('demo.loading.delayHint')" />
      <div style="margin-top: 8px">
        <y-button size="small" @click="delayLoading = !delayLoading">
          {{ delayLoading ? $t('demo.loading.stopLoading') : $t('demo.loading.startLoading') }}
        </y-button>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const containerLoading = ref(true)
const delayLoading = ref(false)
const loadingSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-loading-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.demo-loading-item em {
  font-style: normal;
  color: #bbb;
}
.demo-loading-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.demo-loading-content {
  padding: 20px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
</style>
