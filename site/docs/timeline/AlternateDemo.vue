<template>
  <y-timeline mode="alternate">
    <y-timeline-item :title="t('demo.timeline.plan')" :time="t('demo.timeline.time1')" type="primary">
      {{ t('demo.timeline.planDesc') }}
    </y-timeline-item>
    <y-timeline-item :title="t('demo.timeline.develop')" :time="t('demo.timeline.time2')" type="success">
      {{ t('demo.timeline.developDesc') }}
    </y-timeline-item>
    <y-timeline-item :title="t('demo.timeline.verify')" :time="t('demo.timeline.time3')" type="warning">
      {{ t('demo.timeline.verifyDesc') }}
    </y-timeline-item>
  </y-timeline>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
