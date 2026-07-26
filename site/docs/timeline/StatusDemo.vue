<template>
  <y-timeline>
    <y-timeline-item :title="$t('demo.timeline.processing')" type="primary" />
    <y-timeline-item :title="$t('demo.timeline.waiting')" type="warning" hollow />
    <y-timeline-item :title="$t('demo.timeline.failed')" type="error">
      {{ $t('demo.timeline.failedDesc') }}
    </y-timeline-item>
    <y-timeline-item :title="$t('demo.timeline.customColor')" color="#722ed1" />
  </y-timeline>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
