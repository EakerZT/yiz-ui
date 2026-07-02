<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.progress') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.progress.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-progress-list">
        <y-progress :percentage="25" />
        <y-progress :percentage="50" />
        <y-progress :percentage="75" />
      </div>
    </y-card>

    <y-card :title="$t('demo.progress.dynamic')" style="margin-top: 8px">
      <div class="demo-progress-list">
        <y-progress :percentage="percentage" />
        <y-slider v-model:value="percentage" :show-tooltip="false" />
      </div>
    </y-card>

    <y-card :title="$t('demo.progress.status')" style="margin-top: 8px">
      <div class="demo-progress-list">
        <y-progress :percentage="80" status="success" />
        <y-progress :percentage="60" status="warning" />
        <y-progress :percentage="40" status="error" />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.customColor')" style="margin-top: 8px">
      <div class="demo-progress-list">
        <y-progress :percentage="65" color="#722ed1" :stroke-width="12" />
        <y-progress :percentage="35" color="#13c2c2">
          <template #default="{ percentage: value }">{{ value }} / 100</template>
        </y-progress>
        <y-progress :percentage="90" :show-text="false" />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const percentage = ref(40)
</script>

<style scoped>
.demo-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
