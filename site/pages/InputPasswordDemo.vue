<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.inputPassword.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.inputPassword.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input-password v-model:value="password" :placeholder="$t('demo.inputPassword.placeholder')" />
      <span class="demo-hint">
        {{ $t('demo.inputPassword.currentValue', { value: password || $t('demo.common.empty') }) }}
      </span>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-input-password v-model:value="clearPassword" :placeholder="$t('demo.common.clearable')" clearable />
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-input-row">
        <y-radio-button-group v-model:value="passwordSize" :options="sizeOptions" />
        <y-input-password
          v-model:value="sizePassword"
          :placeholder="$t('demo.inputPassword.placeholder')"
          :size="passwordSize"
        />
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-input-password v-model:value="disabledPassword" :placeholder="$t('demo.common.disabled')" disabled />
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-input-password
        v-model:value="affixPassword"
        :placeholder="$t('demo.inputPassword.placeholder')"
        prefix="Key"
        suffix="Safe"
        clearable
      />
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.inputPassword.noToggle')" style="margin-top: 8px">
      <y-input-password
        v-model:value="fixedPassword"
        :placeholder="$t('demo.inputPassword.placeholder')"
        :show-toggle="false"
      />
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const password = ref('')
const clearPassword = ref('')
const sizePassword = ref('')
const disabledPassword = ref('disabled-password')
const affixPassword = ref('')
const fixedPassword = ref('')
const passwordSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.demo-input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
