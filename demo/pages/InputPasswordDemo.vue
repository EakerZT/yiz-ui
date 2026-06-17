<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.inputPassword.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.inputPassword.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input-password v-model:value="password" :placeholder="$t('demo.inputPassword.placeholder')" />
      <span class="demo-hint">
        {{ $t('demo.inputPassword.currentValue', { value: password || $t('demo.common.empty') }) }}
      </span>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-input-password v-model:value="clearPassword" :placeholder="$t('demo.common.clearable')" clearable />
    </y-card>

    <y-card :title="$t('demo.inputPassword.noToggle')" style="margin-top: 8px">
      <y-input-password
        v-model:value="fixedPassword"
        :placeholder="$t('demo.inputPassword.placeholder')"
        :show-toggle="false"
      />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const password = ref('')
const clearPassword = ref('')
const fixedPassword = ref('')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
