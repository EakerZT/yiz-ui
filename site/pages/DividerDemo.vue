<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.divider.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.divider.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <p>{{ $t('demo.divider.paragraph') }}</p>
      <y-divider />
      <p>{{ $t('demo.divider.paragraph') }}</p>
    </y-card>

    <y-card :title="$t('demo.divider.withText')" style="margin-top: 8px">
      <y-divider>{{ $t('demo.divider.centerText') }}</y-divider>
      <y-divider text-placement="left">{{ $t('demo.divider.leftText') }}</y-divider>
      <y-divider text-placement="right">{{ $t('demo.divider.rightText') }}</y-divider>
    </y-card>

    <y-card :title="$t('demo.divider.dashed')" style="margin-top: 8px">
      <y-divider dashed />
      <y-divider dashed>{{ $t('demo.divider.dashedText') }}</y-divider>
    </y-card>

    <y-card :title="$t('demo.divider.vertical')" style="margin-top: 8px">
      <span>{{ $t('demo.common.view') }}</span>
      <y-divider direction="vertical" />
      <span>{{ $t('demo.common.edit') }}</span>
      <y-divider direction="vertical" />
      <span>{{ $t('demo.common.delete') }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
