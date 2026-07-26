<template>
  <y-timeline>
    <y-timeline-item :title="$t('demo.timeline.create')" :time="$t('demo.timeline.time1')">
      {{ $t('demo.timeline.createDesc') }}
    </y-timeline-item>
    <y-timeline-item :title="$t('demo.timeline.review')" :time="$t('demo.timeline.time2')" type="primary">
      <span class="color:red">*</span>{{ $t('demo.timeline.reviewDesc') }}
    </y-timeline-item>
    <y-timeline-item :title="$t('demo.timeline.release')" :time="$t('demo.timeline.time3')" type="success">
      {{ $t('demo.timeline.releaseDesc') }}
    </y-timeline-item>
  </y-timeline>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
