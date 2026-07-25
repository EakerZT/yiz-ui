<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.switch') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.switch.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-switch v-model:value="v1" />
      <span class="demo-hint">{{ v1 ? $t('demo.switch.on') : $t('demo.switch.off') }}</span>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model:value="v2" disabled />
        <y-switch v-model:value="v3" disabled />
      </y-button-group>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-switch-size-panel">
        <y-radio-button-group v-model:value="switchSize" :options="sizeOptions" />
        <y-switch v-model:value="v4" :size="switchSize" />
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.button.customColor')" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model:value="v6" color="#67c23a" />
        <y-switch v-model:value="v7" color="#ff4d4f" />
      </y-button-group>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.common.loading')" style="margin-top: 8px">
      <y-switch v-model:value="v8" loading />
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.event')" style="margin-top: 8px">
      <y-switch v-model:value="v9" @change="onChange" />
      <span class="demo-hint">{{ $t('demo.switch.toggleCount', { count: changeCount }) }}</span>
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.switch.customValue')" style="margin-top: 8px">
      <y-switch v-model:value="v10" checked-value="enabled" unchecked-value="disabled" />
      <span class="demo-hint">{{ v10 }}</span>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const v1 = ref(true)
const v2 = ref(false)
const v3 = ref(true)
const v4 = ref(true)
const v6 = ref(true)
const v7 = ref(true)
const v8 = ref(true)
const v9 = ref(true)
const v10 = ref('enabled')
const switchSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
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

.demo-switch-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
