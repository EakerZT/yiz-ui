<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.collapse.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.collapse.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-collapse v-model:value="basicValue">
        <y-collapse-item name="profile" :title="$t('demo.collapse.profileTitle')">
          {{ $t('demo.collapse.profileContent') }}
        </y-collapse-item>
        <y-collapse-item name="permission" :title="$t('demo.collapse.permissionTitle')">
          {{ $t('demo.collapse.permissionContent') }}
        </y-collapse-item>
      </y-collapse>
      <p class="demo-collapse-info">{{ $t('demo.collapse.activeValue', { value: basicValue.join(', ') }) }}</p>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.collapse.accordion')" style="margin-top: 8px">
      <y-collapse v-model:value="accordionValue" accordion>
        <y-collapse-item name="account" :title="$t('demo.collapse.accountTitle')">
          {{ $t('demo.collapse.accountContent') }}
        </y-collapse-item>
        <y-collapse-item name="security" :title="$t('demo.collapse.securityTitle')">
          {{ $t('demo.collapse.securityContent') }}
        </y-collapse-item>
        <y-collapse-item name="notice" :title="$t('demo.collapse.noticeTitle')">
          {{ $t('demo.collapse.noticeContent') }}
        </y-collapse-item>
      </y-collapse>
      <p class="demo-collapse-info">
        {{ $t('demo.collapse.activeValue', { value: accordionValue ?? $t('demo.common.none') }) }}
      </p>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-collapse v-model:value="disabledValue">
        <y-collapse-item name="enabled" :title="$t('demo.collapse.enabledPanel')">
          {{ $t('demo.collapse.enabledContent') }}
        </y-collapse-item>
        <y-collapse-item name="disabled" :title="$t('demo.collapse.disabledPanel')" disabled>
          {{ $t('demo.collapse.disabledContent') }}
        </y-collapse-item>
      </y-collapse>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.customTitle')" style="margin-top: 8px">
      <y-collapse v-model:value="slotValue" :bordered="false">
        <y-collapse-item name="slot">
          <template #title>
            <span class="demo-collapse-title">{{ $t('demo.collapse.slotTitle') }}</span>
          </template>
          <template #extra>
            <y-link-button @click="extraClickCount++">{{ $t('demo.collapse.extraAction') }}</y-link-button>
          </template>
          {{ $t('demo.collapse.slotContent') }}
        </y-collapse-item>
      </y-collapse>
      <p class="demo-collapse-info">{{ $t('demo.collapse.extraCount', { count: extraClickCount }) }}</p>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const basicValue = ref(['profile'])
const accordionValue = ref<string | undefined>('security')
const disabledValue = ref(['enabled'])
const slotValue = ref(['slot'])
const extraClickCount = ref(0)
</script>

<style scoped>
.demo-collapse-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-collapse-title {
  color: var(--yiz-color-primary);
  font-weight: 600;
}
</style>
