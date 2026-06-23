<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.timeline.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.timeline.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
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
    </y-card>

    <y-card :title="$t('demo.common.status')" style="margin-top: 16px">
      <y-timeline>
        <y-timeline-item :title="$t('demo.timeline.processing')" type="primary" />
        <y-timeline-item :title="$t('demo.timeline.waiting')" type="warning" hollow />
        <y-timeline-item :title="$t('demo.timeline.failed')" type="error">
          {{ $t('demo.timeline.failedDesc') }}
        </y-timeline-item>
        <y-timeline-item :title="$t('demo.timeline.customColor')" color="#722ed1" />
      </y-timeline>
    </y-card>

    <y-card :title="$t('demo.timeline.alternate')" style="margin-top: 16px">
      <y-timeline mode="alternate">
        <y-timeline-item :title="$t('demo.timeline.plan')" :time="$t('demo.timeline.time1')" type="primary">
          {{ $t('demo.timeline.planDesc') }}
        </y-timeline-item>
        <y-timeline-item :title="$t('demo.timeline.develop')" :time="$t('demo.timeline.time2')" type="success">
          {{ $t('demo.timeline.developDesc') }}
        </y-timeline-item>
        <y-timeline-item :title="$t('demo.timeline.verify')" :time="$t('demo.timeline.time3')" type="warning">
          {{ $t('demo.timeline.verifyDesc') }}
        </y-timeline-item>
      </y-timeline>
    </y-card>

    <y-card :title="$t('demo.common.customSlot')" style="margin-top: 16px">
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
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style lang="less">
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
