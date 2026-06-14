<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.empty') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.empty.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <Empty />
    </y-card>

    <y-card :title="$t('demo.common.customDesc')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.noResult')" />
    </y-card>

    <y-card :title="$t('demo.common.smallSize')" style="margin-top: 8px">
      <Empty size="small" :description="$t('demo.empty.listEmpty')" />
    </y-card>

    <y-card :title="$t('demo.common.customImage')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.networkError')">
        <template #image>
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#d9d9d9" stroke-width="2" />
            <path d="M20 44l24-24M20 20l24 24" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" />
          </svg>
        </template>
      </Empty>
    </y-card>

    <y-card :title="$t('demo.empty.withAction')" style="margin-top: 8px">
      <Empty :description="$t('demo.empty.cartEmpty')">
        <y-button type="primary" size="small">{{ $t('demo.empty.goBrowse') }}</y-button>
      </Empty>
    </y-card>

    <y-card :title="$t('demo.empty.tableEmpty')" style="margin-top: 8px">
      <div style="border: 1px solid #d9d9d9; border-radius: 4px">
        <Empty :description="$t('demo.empty.noData')" size="small" />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { Empty } from 'yiz-ui'
</script>
