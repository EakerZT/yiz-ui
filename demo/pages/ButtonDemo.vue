<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.button') }}</h2>
    <p class="demo-section-desc">
      {{ $t('demo.button.desc') }}
    </p>

    <y-card :title="$t('demo.common.basicShort')">
      <y-button-group>
        <y-button>default</y-button>
        <y-button type="primary">primary</y-button>
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
          <y-button :size="buttonSize">default</y-button>
          <y-button type="primary" :size="buttonSize">primary</y-button>
          <y-button type="plain" :size="buttonSize">plain</y-button>
          <y-button type="primary" color="success" :size="buttonSize">success</y-button>
          <y-button type="primary" color="warning" :size="buttonSize">warning</y-button>
          <y-button type="primary" color="error" :size="buttonSize">error</y-button>
          <y-button type="primary" :size="buttonSize">
            <y-icon :icon="Flash20Regular" />
            Search
          </y-button>
          <y-button type="primary" shape="round" :size="buttonSize">round</y-button>
          <y-button type="primary" shape="circle" :size="buttonSize">
            <y-icon :icon="Flash20Regular" />
          </y-button>
        </y-button-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.withIcon')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">
          <y-icon :icon="Flash20Regular" />
          Search
        </y-button>
        <y-button type="primary" shape="circle">
          <y-icon :icon="Flash20Regular" />
        </y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-button-group>
        <y-button disabled>default</y-button>
        <y-button type="primary" disabled>primary</y-button>
        <y-button type="plain" disabled>plain</y-button>
      </y-button-group>
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
import { Flash20Regular } from '@vicons/fluent'

const count = ref(0)
const linkCount = ref(0)
const buttonSize = ref<'small' | 'middle' | 'large'>('middle')
const buttonSizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'middle', value: 'middle' },
  { label: 'large', value: 'large' }
]
</script>

<style scoped>
.demo-button-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
