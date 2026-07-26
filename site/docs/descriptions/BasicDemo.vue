<template>
  <y-descriptions :title="$t('demo.descriptions.userInfo')">
    <y-description-item :label="$t('demo.descriptions.username')">{{
      $t('demo.common.personZhangsan')
    }}</y-description-item>
    <y-description-item :label="$t('demo.descriptions.phone')">13258350000</y-description-item>
    <y-description-item :label="$t('demo.descriptions.city')">{{ $t('demo.common.shanghai') }}</y-description-item>
    <y-description-item :label="$t('demo.descriptions.role')">{{ $t('demo.common.roleFrontend') }}</y-description-item>
    <y-description-item :label="$t('demo.descriptions.department')">
      {{ $t('demo.common.deptEngineering') }}
    </y-description-item>
    <y-description-item :label="$t('demo.descriptions.status')">
      <y-tag>{{ $t('demo.common.enabled') }}</y-tag>
    </y-description-item>
  </y-descriptions>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
