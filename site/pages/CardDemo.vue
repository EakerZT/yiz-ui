<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.card') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.card.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <Card :title="$t('demo.card.cardTitle')" style="width: 360px">
        <p>{{ $t('demo.card.content') }}</p>
      </Card>
    </y-card>

    <y-card :title="$t('demo.card.border')" style="margin-top: 8px">
      <y-button-group>
        <Card :title="$t('demo.card.bordered')" style="width: 300px">
          <p>{{ $t('demo.card.borderedDefault') }}</p>
        </Card>
        <Card :title="$t('demo.common.withoutBorder')" :bordered="false" style="width: 300px">
          <p>{{ $t('demo.card.borderlessHint') }}</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.card.shadow')" style="margin-top: 8px">
      <y-button-group>
        <Card :title="$t('demo.card.shadowHover')" shadow="hover" style="width: 280px">
          <p>{{ $t('demo.card.shadowHoverHint') }}</p>
        </Card>
        <Card :title="$t('demo.card.shadowAlways')" shadow="always" style="width: 280px">
          <p>{{ $t('demo.card.shadowAlwaysHint') }}</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <Card :title="$t('demo.card.defaultSize')" style="width: 280px">
          <p>{{ $t('demo.card.defaultSizeHint') }}</p>
        </Card>
        <Card :title="$t('demo.common.smallSize')" size="small" style="width: 280px">
          <p>{{ $t('demo.card.smallSizeHint') }}</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.card.extraHeader')" style="margin-top: 8px">
      <Card :title="$t('demo.card.userList')" style="width: 400px">
        <template #extra>
          <span class="demo-link">{{ $t('demo.common.more') }}</span>
        </template>
        <p>{{ $t('demo.card.extraHint') }}</p>
      </Card>
    </y-card>

    <y-card :title="$t('demo.card.cover')" style="margin-top: 8px">
      <Card :title="$t('demo.card.landscape')" style="width: 320px">
        <template #cover>
          <div class="demo-cover">{{ $t('demo.card.coverArea') }}</div>
        </template>
        <p>{{ $t('demo.card.coverHint') }}</p>
      </Card>
    </y-card>

    <y-card :title="$t('demo.common.customTitle')" style="margin-top: 8px">
      <Card style="width: 360px">
        <template #title>
          <span style="color: var(--yiz-color-primary); font-weight: 600">{{ $t('demo.card.customTitleStyle') }}</span>
        </template>
        <p>{{ $t('demo.card.customTitleHint') }}</p>
      </Card>
    </y-card>

    <y-card :title="$t('demo.card.footerActions')" style="margin-top: 8px">
      <Card :title="$t('demo.card.confirmAction')" style="width: 360px">
        <p>{{ $t('demo.card.confirmMsg') }}</p>
        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <y-button>{{ $t('demo.common.cancel') }}</y-button>
            <y-button type="primary">{{ $t('demo.common.confirm') }}</y-button>
          </div>
        </template>
      </Card>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { Card } from 'yiz-ui'
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
</style>
