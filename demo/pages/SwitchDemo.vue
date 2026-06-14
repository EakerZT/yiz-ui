<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.switch') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.switch.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-switch v-model="v1" />
      <span class="demo-hint">{{ v1 ? $t('demo.switch.on') : $t('demo.switch.off') }}</span>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v2" disabled />
        <y-switch v-model="v3" disabled />
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v4" />
        <y-switch v-model="v5" size="small" />
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.button.customColor')" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v6" color="#67c23a" />
        <y-switch v-model="v7" color="#ff4d4f" />
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.loading')" style="margin-top: 8px">
      <y-switch v-model="v8" loading />
    </y-card>

    <y-card :title="$t('demo.common.event')" style="margin-top: 8px">
      <y-switch v-model="v9" @change="onChange" />
      <span class="demo-hint">{{ $t('demo.switch.toggleCount', { count: changeCount }) }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const v1 = ref(true)
const v2 = ref(false)
const v3 = ref(true)
const v4 = ref(true)
const v5 = ref(true)
const v6 = ref(true)
const v7 = ref(true)
const v8 = ref(true)
const v9 = ref(true)
const changeCount = ref(0)

function onChange() {
  changeCount.value++
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}
</style>
