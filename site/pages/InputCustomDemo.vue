<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.inputCustom.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.inputCustom.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input-custom style="width: 240px" @click="toggleStatus">
        <span class="demo-input-custom-value">{{ statusLabel }}</span>
      </y-input-custom>
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <div class="demo-input-custom-stack">
        <y-radio-button-group v-model:value="customSize" :options="sizeOptions" />
        <y-input-custom :size="customSize" style="width: 280px">
          <template #prefix>
            <y-icon :icon="Search20Regular" />
          </template>
          <input v-model="keyword" class="demo-input-custom-native" :placeholder="$t('demo.inputCustom.keyword')" />
          <template #suffix>{{ keyword.length }}</template>
        </y-input-custom>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-input-custom disabled style="width: 240px">
        <span class="demo-input-custom-placeholder">{{ $t('demo.inputCustom.disabledValue') }}</span>
      </y-input-custom>
    </y-card>

    <y-card :title="$t('demo.nav.inputGroup')" style="margin-top: 8px">
      <y-input-group>
        <template #beforeAddon>{{ $t('demo.inputCustom.filter') }}</template>
        <y-input-custom style="width: 180px" @click="toggleStatus">
          <span class="demo-input-custom-value">{{ statusLabel }}</span>
        </y-input-custom>
        <y-button type="primary">{{ $t('demo.inputGroup.searchButton') }}</y-button>
      </y-input-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'
import { Search20Regular } from '@vicons/fluent'

type DemoSize = 'small' | 'default' | 'large'

const statuses = ['pending', 'running', 'done'] as const
const status = ref<(typeof statuses)[number]>('pending')
const keyword = ref('')
const customSize = ref<DemoSize>('default')

const statusLabel = computed(() => $t(`demo.inputCustom.status.${status.value}`))

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

function toggleStatus() {
  const index = statuses.indexOf(status.value)
  status.value = statuses[(index + 1) % statuses.length]
}
</script>

<style scoped>
.demo-input-custom-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.demo-input-custom-value {
  color: #333;
  white-space: nowrap;
}

.demo-input-custom-placeholder {
  color: #c0c4cc;
}

.demo-input-custom-native {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: #333;
  font: inherit;
}

.demo-input-custom-native::placeholder {
  color: #c0c4cc;
}
</style>
