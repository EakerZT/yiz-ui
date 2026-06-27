<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.inputGroup.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.inputGroup.desc') }}</p>

    <y-card :title="$t('demo.inputGroup.addonProps')" style="margin-top: 8px">
      <y-input-group before-addon="https://" after-addon=".com">
        <y-input v-model:value="domain" :placeholder="$t('demo.inputGroup.domain')" />
      </y-input-group>
    </y-card>

    <y-card :title="$t('demo.inputGroup.addonSlots')" style="margin-top: 8px">
      <y-input-group>
        <template #beforeAddon>¥</template>
        <y-input-number v-model="price" :controls="false" />
        <template #afterAddon>{{ $t('demo.inputGroup.perMonth') }}</template>
      </y-input-group>
    </y-card>

    <y-card :title="$t('demo.inputGroup.search')" style="margin-top: 8px">
      <y-input-group>
        <y-select v-model="city" :options="cityOptions" style="width: 128px" />
        <y-input v-model:value="keyword" :placeholder="$t('demo.inputGroup.keyword')" style="width: 220px" />
        <y-button type="primary">{{ $t('demo.inputGroup.searchButton') }}</y-button>
      </y-input-group>
    </y-card>

    <y-card :title="$t('demo.inputGroup.password')" style="margin-top: 8px">
      <y-input-group :before-addon="$t('demo.inputGroup.accountAddon')">
        <y-input v-model:value="account" :placeholder="$t('demo.inputGroup.account')" style="width: 180px" />
        <y-input-password
          v-model:value="password"
          :placeholder="$t('demo.inputGroup.passwordPlaceholder')"
          style="width: 220px"
        />
        <y-button>{{ $t('demo.inputGroup.login') }}</y-button>
      </y-input-group>
    </y-card>

    <y-card :title="$t('demo.inputGroup.pickers')" style="margin-top: 8px">
      <div class="demo-input-group-stack">
        <y-input-group>
          <y-date-picker v-model="dateValue" clearable style="width: 180px" />
          <y-button>{{ $t('demo.common.confirm') }}</y-button>
        </y-input-group>
        <y-input-group>
          <y-time-picker v-model="timeValue" clearable style="width: 180px" />
          <y-button>{{ $t('demo.common.confirm') }}</y-button>
        </y-input-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-input-group-stack">
        <y-radio-button-group v-model:value="groupSize" :options="sizeOptions" />
        <y-input-group :size="groupSize">
          <y-select v-model="city" :options="cityOptions" style="width: 128px" />
          <y-input v-model:value="keyword" :placeholder="$t('demo.inputGroup.keyword')" style="width: 220px" />
          <y-button type="primary">{{ $t('demo.inputGroup.searchButton') }}</y-button>
        </y-input-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.inputGroup.block')" style="margin-top: 8px">
      <y-input-group block before-addon="https://" after-addon=".com">
        <y-input v-model:value="blockDomain" :placeholder="$t('demo.inputGroup.domain')" style="flex: 1" />
        <y-button type="primary">{{ $t('demo.inputGroup.visit') }}</y-button>
      </y-input-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const domain = ref('yiz-ui')
const blockDomain = ref('docs')
const price = ref<number | null>(99)
const city = ref('beijing')
const keyword = ref('')
const account = ref('')
const password = ref('')
const dateValue = ref<Date | null>(null)
const timeValue = ref<string | null>(null)
const groupSize = ref<DemoSize>('default')

const cityOptions = [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: $t('demo.common.shenzhen'), value: 'shenzhen' }
]

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' }
]
</script>

<style scoped>
.demo-input-group-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
