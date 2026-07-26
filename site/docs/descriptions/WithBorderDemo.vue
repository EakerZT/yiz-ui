<template>
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
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
