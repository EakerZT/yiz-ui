<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.breadcrumb.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.breadcrumb.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-breadcrumb>
        <y-breadcrumb-item href="#/">{{ $t('demo.breadcrumb.home') }}</y-breadcrumb-item>
        <y-breadcrumb-item href="#/button">{{ $t('demo.breadcrumb.components') }}</y-breadcrumb-item>
        <y-breadcrumb-item>{{ $t('demo.breadcrumb.current') }}</y-breadcrumb-item>
      </y-breadcrumb>
    </y-card>

    <y-card :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-breadcrumb>
        <template #separator>/</template>
        <y-breadcrumb-item>{{ $t('demo.breadcrumb.workspace') }}</y-breadcrumb-item>
        <y-breadcrumb-item>{{ $t('demo.breadcrumb.project') }}</y-breadcrumb-item>
        <y-breadcrumb-item>
          <span class="demo-breadcrumb-current">{{ $t('demo.breadcrumb.issue') }}</span>
        </y-breadcrumb-item>
      </y-breadcrumb>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-breadcrumb>
        <y-breadcrumb-item @click="onBreadcrumbClick(1)">{{ $t('demo.breadcrumb.home') }}</y-breadcrumb-item>
        <y-breadcrumb-item disabled>{{ $t('demo.breadcrumb.disabled') }}</y-breadcrumb-item>
        <y-breadcrumb-item>{{ $t('demo.breadcrumb.current') }}</y-breadcrumb-item>
      </y-breadcrumb>
      <p class="demo-breadcrumb-info">{{ $t('demo.breadcrumb.lastClick', { value: lastClick }) }}</p>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const lastClick = ref($t('demo.common.none'))

function onBreadcrumbClick(index: number) {
  lastClick.value = String(index)
}
</script>

<style scoped>
.demo-breadcrumb-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-breadcrumb-current {
  font-weight: 500;
}
</style>
