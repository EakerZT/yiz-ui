<template>
  <y-button-group>
    <y-card :title="$t('demo.card.shadowHover')" shadow="hover" style="width: 280px">
      <p>{{ $t('demo.card.shadowHoverHint') }}</p>
    </y-card>
    <y-card :title="$t('demo.card.shadowAlways')" shadow="always" style="width: 280px">
      <p>{{ $t('demo.card.shadowAlwaysHint') }}</p>
    </y-card>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
