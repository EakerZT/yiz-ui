<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.card') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.card.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')" style="margin-top: 8px">
      <Card :title="$t('demo.card.cardTitle')" style="width: 360px">
        <p>{{ $t('demo.card.content') }}</p>
      </Card>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.card.border')" style="margin-top: 8px">
      <y-button-group>
        <Card :title="$t('demo.card.bordered')" style="width: 300px">
          <p>{{ $t('demo.card.borderedDefault') }}</p>
        </Card>
        <Card :title="$t('demo.common.withoutBorder')" :bordered="false" style="width: 300px">
          <p>{{ $t('demo.card.borderlessHint') }}</p>
        </Card>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.card.shadow')" style="margin-top: 8px">
      <y-button-group>
        <Card :title="$t('demo.card.shadowHover')" shadow="hover" style="width: 280px">
          <p>{{ $t('demo.card.shadowHoverHint') }}</p>
        </Card>
        <Card :title="$t('demo.card.shadowAlways')" shadow="always" style="width: 280px">
          <p>{{ $t('demo.card.shadowAlwaysHint') }}</p>
        </Card>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-card-size-panel">
        <y-radio-button-group v-model:value="cardSize" :options="sizeOptions" />
        <Card :title="$t('demo.card.defaultSize')" :size="cardSize" style="width: 280px">
          <p>{{ $t('demo.card.defaultSizeHint') }}</p>
        </Card>
      </div>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.card.extraHeader')" style="margin-top: 8px">
      <Card :title="$t('demo.card.userList')" style="width: 400px">
        <template #extra>
          <span class="demo-link">{{ $t('demo.common.more') }}</span>
        </template>
        <p>{{ $t('demo.card.extraHint') }}</p>
      </Card>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.card.cover')" style="margin-top: 8px">
      <Card :title="$t('demo.card.landscape')" style="width: 320px">
        <template #cover>
          <div class="demo-cover">{{ $t('demo.card.coverArea') }}</div>
        </template>
        <p>{{ $t('demo.card.coverHint') }}</p>
      </Card>
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.common.customTitle')" style="margin-top: 8px">
      <Card style="width: 360px">
        <template #title>
          <span style="color: var(--yiz-color-primary); font-weight: 600">{{ $t('demo.card.customTitleStyle') }}</span>
        </template>
        <p>{{ $t('demo.card.customTitleHint') }}</p>
      </Card>
    </demo-card>

    <demo-card :source-index="7" :title="$t('demo.card.footerActions')" style="margin-top: 8px">
      <Card :title="$t('demo.card.confirmAction')" style="width: 360px">
        <p>{{ $t('demo.card.confirmMsg') }}</p>
        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <y-button>{{ $t('demo.common.cancel') }}</y-button>
            <y-button type="primary">{{ $t('demo.common.confirm') }}</y-button>
          </div>
        </template>
      </Card>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { Card } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const cardSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-cover {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.demo-link {
  color: var(--yiz-color-primary);
  cursor: pointer;
  font-size: 14px;
}
.demo-link:hover {
  text-decoration: underline;
}

.demo-card-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
