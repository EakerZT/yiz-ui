<template>
  <y-timeline>
    <y-timeline-item :title="$t('demo.timeline.upload')" :time="$t('demo.timeline.time1')">
      <template #dot>
        <span class="demo-timeline-dot">1</span>
      </template>
      {{ $t('demo.timeline.uploadDesc') }}
    </y-timeline-item>
    <y-timeline-item :time="$t('demo.timeline.time2')" type="success">
      <template #title>
        <span style="color: var(--yiz-color-success)">{{ $t('demo.timeline.done') }}</span>
      </template>
      <template #dot>
        <span class="demo-timeline-dot demo-timeline-dot-success">2</span>
      </template>
      {{ $t('demo.timeline.doneDesc') }}
    </y-timeline-item>
  </y-timeline>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style>
.demo-timeline-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--yiz-color-primary);
  color: #fff;
  font-size: 12px;
  line-height: 18px;
}
.demo-timeline-dot-success {
  background: var(--yiz-color-success);
}
</style>
