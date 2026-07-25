<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.empty') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.empty.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')" style="margin-top: 8px">
      <Empty />
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.common.customDesc')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.noResult')" />
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-empty-size-panel">
        <y-radio-button-group v-model:value="emptySize" :options="sizeOptions" />
        <Empty :size="emptySize" :description="$t('demo.empty.listEmpty')" />
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.customImage')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.networkError')">
        <template #image>
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#d9d9d9" stroke-width="2" />
            <path d="M20 44l24-24M20 20l24 24" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" />
          </svg>
        </template>
      </Empty>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.empty.withAction')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.cartEmpty')">
        <y-button type="primary" size="small">{{ $t('demo.empty.goBrowse') }}</y-button>
      </Empty>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.empty.tableEmpty')" style="margin-top: 8px">
      <div style="border: 1px solid #d9d9d9; border-radius: 4px">
        <Empty :description="$t('demo.empty.noData')" size="small" />
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { Empty } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const emptySize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-empty-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
