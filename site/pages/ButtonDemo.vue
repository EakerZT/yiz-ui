<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.button') }}</h2>
    <p class="demo-section-desc">
      {{ $t('demo.button.desc') }}
    </p>

    <y-card :title="$t('demo.common.basicShort')">
      <y-button-group wrap gap="8">
        <y-button type="primary">primary</y-button>
        <y-button>outlined</y-button>
        <y-button type="dash">dash</y-button>
        <y-button type="filled">filled</y-button>
        <y-button type="text">text</y-button>
        <y-button type="plain">plain</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.color')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">default</y-button>
        <y-button type="primary" color="success">success</y-button>
        <y-button type="primary" color="warning">warning</y-button>
        <y-button type="primary" color="error">error</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.customColor')" style="margin-top: 8px">
      <y-button-group>
        <y-button color="#8a2be2">#8a2be2</y-button>
        <y-button type="primary" color="#8a2be2">#8a2be2</y-button>
        <y-button type="dash" color="#8a2be2">#8a2be2</y-button>
        <y-button type="filled" color="#8a2be2">#8a2be2</y-button>
        <y-button type="text" color="#8a2be2">#8a2be2</y-button>
        <y-button type="plain" color="#8a2be2">#8a2be2</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.shape')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">default</y-button>
        <y-button type="primary" shape="round">round</y-button>
        <y-button type="primary" shape="circle">A</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-button-size-panel">
        <y-radio-button-group v-model:value="buttonSize" :options="buttonSizeOptions" />
        <y-button-group wrap gap="8">
          <y-button :size="buttonSize">outlined</y-button>
          <y-button type="primary" :size="buttonSize">primary</y-button>
          <y-button type="dash" :size="buttonSize">dash</y-button>
          <y-button type="filled" :size="buttonSize">filled</y-button>
          <y-button type="text" :size="buttonSize">text</y-button>
          <y-button type="plain" :size="buttonSize">plain</y-button>
          <y-button type="primary" color="success" :size="buttonSize">success</y-button>
          <y-button type="primary" color="warning" :size="buttonSize">warning</y-button>
          <y-button type="primary" color="error" :size="buttonSize">error</y-button>
          <y-button type="primary" :size="buttonSize">
            <y-icon size="16" :icon="Flash16Regular" />
          </y-button>
          <y-button type="primary" :size="buttonSize">
            <y-icon size="16" :icon="Flash16Regular" />
            Search
          </y-button>
          <y-button type="primary" shape="round" :size="buttonSize">round</y-button>
          <y-button type="primary" shape="round" :size="buttonSize">
            <y-icon size="16" :icon="Flash16Regular" />
          </y-button>
          <y-button type="primary" shape="circle" :size="buttonSize">
            <y-icon size="16" :icon="Flash16Regular" />
          </y-button>
        </y-button-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.withIcon')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">
          <y-icon :icon="Flash16Regular" />
          Search
        </y-button>
        <y-button type="primary" shape="circle">
          <y-icon :icon="Flash16Regular" />
        </y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-button-group>
        <y-button disabled>outlined</y-button>
        <y-button type="primary" disabled>primary</y-button>
        <y-button type="dash" disabled>dash</y-button>
        <y-button type="filled" disabled>filled</y-button>
        <y-button type="text" disabled>text</y-button>
        <y-button type="plain" disabled>plain</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.loading')" style="margin-top: 8px">
      <div class="demo-button-loading-panel">
        <y-switch v-model:value="buttonLoading" />
        <y-button-group>
          <y-button :loading="buttonLoading">outlined</y-button>
          <y-button type="primary" color="error" :loading="buttonLoading">primary</y-button>
          <y-button type="primary" :loading="buttonLoading">primary</y-button>
          <y-button type="plain" :loading="buttonLoading">plain</y-button>
          <y-button type="plain" color="error" :loading="buttonLoading">plain</y-button>
          <y-button type="primary" shape="circle" :loading="buttonLoading">
            <y-icon :icon="Flash16Regular" />
          </y-button>
        </y-button-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.button.clickEvent')" style="margin-top: 8px">
      <y-button @click="count++">{{ $t('demo.button.clickCount', { count }) }}</y-button>
    </y-card>

    <y-card :title="$t('demo.button.link')" style="margin-top: 8px">
      <y-button-group>
        <y-link-button>primary</y-link-button>
        <y-link-button color="default">default</y-link-button>
        <y-link-button color="success">success</y-link-button>
        <y-link-button color="warning">warning</y-link-button>
        <y-link-button color="error">error</y-link-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.linkColor')" style="margin-top: 8px">
      <y-button-group>
        <y-link-button color="#8a2be2">#8a2be2</y-link-button>
        <y-link-button color="#ff6b35">#ff6b35</y-link-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.linkUnderline')" style="margin-top: 8px">
      <y-link-button underline>{{ $t('demo.button.linkUnderlineHint') }}</y-link-button>
    </y-card>

    <y-card :title="$t('demo.button.linkDisabled')" style="margin-top: 8px">
      <y-button-group>
        <y-link-button disabled>disabled</y-link-button>
        <y-link-button color="error" disabled>error disabled</y-link-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.linkClick')" style="margin-top: 8px">
      <y-link-button @click="linkCount++">{{ $t('demo.button.clickCount', { count: linkCount }) }}</y-link-button>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { Flash16Regular } from '@vicons/fluent'

const count = ref(0)
const linkCount = ref(0)
const buttonLoading = ref(true)
const buttonSize = ref<'small' | 'default' | 'large'>('default')
const buttonSizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-button-size-panel,
.demo-button-loading-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
