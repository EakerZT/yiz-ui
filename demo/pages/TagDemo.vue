<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tag') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tag.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button-group>
        <y-tag>{{ $t('demo.tab.tab1') }}</y-tag>
        <y-tag color="primary">Primary</y-tag>
        <y-tag color="success">Success</y-tag>
        <y-tag color="warning">Warning</y-tag>
        <y-tag color="error">Error</y-tag>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <y-tag size="small">{{ $t('demo.tag.smallTag') }}</y-tag>
        <y-tag>{{ $t('demo.tag.defaultTag') }}</y-tag>
        <y-tag size="large">{{ $t('demo.tag.largeTag') }}</y-tag>
      </y-button-group>
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
        <y-tag color="primary" :bordered="false">Primary</y-tag>
        <y-tag color="success" :bordered="false">Success</y-tag>
        <y-tag color="warning" :bordered="false">Warning</y-tag>
        <y-tag color="error" :bordered="false">Error</y-tag>
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

const tags = ref([$t('demo.tab.tab1'), $t('demo.tab.tab2'), $t('demo.tab.tab3'), $t('demo.tag.tag4')])

function handleClose(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function addTag() {
  const n = tags.value.length + 1
  tags.value.push($t('demo.tag.tagN', { index: n }))
}
</script>
