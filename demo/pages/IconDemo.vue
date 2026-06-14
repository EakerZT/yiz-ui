<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.icon') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.icon.desc') }}</p>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <span v-for="s in [12, 16, 20, 28, 36]" :key="s" class="demo-icon-item">
          <y-icon :icon="Flash20Regular" :size="s" />
          <em>{{ s }}px</em>
        </span>
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { Flash20Regular } from '@vicons/fluent'
</script>

<style scoped>
.demo-icon-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.demo-icon-item em {
  font-style: normal;
  color: #bbb;
}
</style>
