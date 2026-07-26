<template>
  <y-button-group>
    <y-card :title="$t('demo.card.bordered')" style="width: 300px">
      <p>{{ $t('demo.card.borderedDefault') }}</p>
    </y-card>
    <y-card :title="$t('demo.common.withoutBorder')" :bordered="false" style="width: 300px">
      <p>{{ $t('demo.card.borderlessHint') }}</p>
    </y-card>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
