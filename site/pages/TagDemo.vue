<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tag') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tag.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button-group>
        <y-tag>{{ $t('demo.tab.tab1') }}</y-tag>
        <y-tag color="primary">{{ $t('demo.common.primary') }}</y-tag>
        <y-tag color="success">{{ $t('demo.common.success') }}</y-tag>
        <y-tag color="warning">{{ $t('demo.common.warning') }}</y-tag>
        <y-tag color="error">{{ $t('demo.common.error') }}</y-tag>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-tag-size-panel">
        <y-radio-button-group v-model:value="tagSize" :options="sizeOptions" />
        <y-button-group>
          <y-tag :size="tagSize">{{ $t('demo.tag.defaultTag') }}</y-tag>
          <y-tag color="primary" :size="tagSize">{{ $t('demo.common.primary') }}</y-tag>
          <y-tag color="success" :size="tagSize">{{ $t('demo.common.success') }}</y-tag>
        </y-button-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.closable')" style="margin-top: 8px">
      <y-button-group>
        <y-tag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
          {{ tag }}
        </y-tag>
      </y-button-group>
      <div style="margin-top: 8px">
        <y-button size="small" @click="addTag">{{ $t('demo.tag.addTag') }}</y-button>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.withoutBorder')" style="margin-top: 8px">
      <y-button-group>
        <y-tag :bordered="false">{{ $t('demo.common.default') }}</y-tag>
        <y-tag color="primary" :bordered="false">{{ $t('demo.common.primary') }}</y-tag>
        <y-tag color="success" :bordered="false">{{ $t('demo.common.success') }}</y-tag>
        <y-tag color="warning" :bordered="false">{{ $t('demo.common.warning') }}</y-tag>
        <y-tag color="error" :bordered="false">{{ $t('demo.common.error') }}</y-tag>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.customColor')" style="margin-top: 8px">
      <y-button-group>
        <y-tag color="#f50">#f50</y-tag>
        <y-tag color="#2db7f5">#2db7f5</y-tag>
        <y-tag color="#87d068">#87d068</y-tag>
        <y-tag color="#108ee9">#108ee9</y-tag>
        <y-tag color="#f50" closable>{{ $t('demo.common.closable') }}</y-tag>
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const tags = ref([$t('demo.tab.tab1'), $t('demo.tab.tab2'), $t('demo.tab.tab3'), $t('demo.tag.tag4')])
const tagSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

function handleClose(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
}

function addTag() {
  const n = tags.value.length + 1
  tags.value.push($t('demo.tag.tagN', { index: n }))
}
</script>

<style scoped>
.demo-tag-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
