<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.descriptions.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.descriptions.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-descriptions :title="$t('demo.descriptions.userInfo')">
        <y-description-item :label="$t('demo.descriptions.username')">{{
          $t('demo.common.personZhangsan')
        }}</y-description-item>
        <y-description-item :label="$t('demo.descriptions.phone')">13258350000</y-description-item>
        <y-description-item :label="$t('demo.descriptions.city')">{{ $t('demo.common.shanghai') }}</y-description-item>
        <y-description-item :label="$t('demo.descriptions.role')">{{
          $t('demo.common.roleFrontend')
        }}</y-description-item>
        <y-description-item :label="$t('demo.descriptions.department')">
          {{ $t('demo.common.deptEngineering') }}
        </y-description-item>
        <y-description-item :label="$t('demo.descriptions.status')">
          <y-tag>{{ $t('demo.common.enabled') }}</y-tag>
        </y-description-item>
      </y-descriptions>
    </y-card>

    <y-card :title="$t('demo.common.withBorder')" style="margin-top: 8px">
      <y-descriptions bordered :title="$t('demo.descriptions.orderInfo')">
        <y-description-item :label="$t('demo.descriptions.orderNo')">YIZ-20260707-001</y-description-item>
        <y-description-item :label="$t('demo.descriptions.amount')">1280.00</y-description-item>
        <y-description-item :label="$t('demo.descriptions.payStatus')">
          <y-tag color="success">{{ $t('demo.descriptions.paid') }}</y-tag>
        </y-description-item>
        <y-description-item :label="$t('demo.descriptions.payStatus')">
          <y-tag color="success">{{ $t('demo.descriptions.paid') }}</y-tag>
        </y-description-item>
        <y-description-item :label="$t('demo.descriptions.address')" :span="3">
          {{ $t('demo.descriptions.addressValue') }}
        </y-description-item>
        <y-description-item :label="$t('demo.descriptions.address')" :span="2">
          {{ $t('demo.descriptions.addressValue') }}
        </y-description-item>
      </y-descriptions>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-descriptions-panel">
        <y-radio-button-group v-model:value="size" :options="sizeOptions" />
        <y-descriptions bordered :size="size" :title="$t('demo.descriptions.sizeTitle')">
          <y-description-item :label="$t('demo.descriptions.username')">
            {{ $t('demo.common.personLisi') }}
          </y-description-item>
          <y-description-item :label="$t('demo.descriptions.role')">{{ $t('demo.common.rolePm') }}</y-description-item>
          <y-description-item :label="$t('demo.descriptions.department')">
            {{ $t('demo.common.deptProduct') }}
          </y-description-item>
        </y-descriptions>
      </div>
    </y-card>

    <y-card :title="$t('demo.descriptions.vertical')" style="margin-top: 8px">
      <y-descriptions bordered layout="vertical" :title="$t('demo.descriptions.projectInfo')">
        <y-description-item :label="$t('demo.descriptions.projectName')">Yiz UI</y-description-item>
        <y-description-item>
          <template #label>
            <span class="demo-descriptions-label">{{ $t('demo.descriptions.version') }}</span>
          </template>
          1.0.0
        </y-description-item>
        <y-description-item :label="$t('demo.descriptions.license')">MIT</y-description-item>
      </y-descriptions>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const size = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-descriptions-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-descriptions-label {
  color: var(--yiz-color-primary);
}
</style>
