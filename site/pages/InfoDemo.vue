<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.info.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.info.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <div class="demo-info-list">
        <y-info :message="$t('demo.info.infoMessage')" />
        <y-info type="success" :message="$t('demo.info.successMessage')" />
        <y-info type="warning" :message="$t('demo.info.warningMessage')" />
        <y-info type="error" :message="$t('demo.info.errorMessage')" />
      </div>
    </y-card>

    <y-card :title="$t('demo.info.description')" style="margin-top: 8px">
      <y-info type="info" :message="$t('demo.info.longMessage')" :description="$t('demo.info.longDescription')" />
    </y-card>

    <y-card :title="$t('demo.info.closable')" style="margin-top: 8px">
      <div class="demo-info-list">
        <y-info closable :message="$t('demo.info.closableMessage')" @close="onClose" />
        <y-info closable :close-text="$t('demo.common.close')" :message="$t('demo.info.closeTextMessage')" />
        <p class="demo-info-event">{{ $t('demo.info.closeCount', { count: closeCount }) }}</p>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-info type="success" :message="$t('demo.info.actionMessage')">
        <template #action>
          <y-button size="small" type="primary">{{ $t('demo.common.view') }}</y-button>
        </template>
        {{ $t('demo.info.actionDescription') }}
      </y-info>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const closeCount = ref(0)

function onClose() {
  closeCount.value += 1
}
</script>

<style scoped>
.demo-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-info-event {
  margin: 0;
  color: #666;
  font-size: 13px;
}
</style>
