<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tag 标签</h2>
    <p class="demo-section-desc">用于标记和分类的标签。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <y-button-group>
        <y-tag>标签一</y-tag>
        <y-tag color="primary">Primary</y-tag>
        <y-tag color="success">Success</y-tag>
        <y-tag color="warning">Warning</y-tag>
        <y-tag color="error">Error</y-tag>
      </y-button-group>
    </y-card>

    <y-card title="尺寸" style="margin-top: 8px">
      <y-button-group>
        <y-tag size="small">小标签</y-tag>
        <y-tag>默认标签</y-tag>
        <y-tag size="large">大标签</y-tag>
      </y-button-group>
    </y-card>

    <y-card title="可关闭" style="margin-top: 8px">
      <y-button-group>
        <y-tag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
          {{ tag }}
        </y-tag>
      </y-button-group>
      <div style="margin-top: 8px">
        <y-button size="small" @click="addTag">+ 添加标签</y-button>
      </div>
    </y-card>

    <y-card title="无边框" style="margin-top: 8px">
      <y-button-group>
        <y-tag :bordered="false">默认</y-tag>
        <y-tag color="primary" :bordered="false">Primary</y-tag>
        <y-tag color="success" :bordered="false">Success</y-tag>
        <y-tag color="warning" :bordered="false">Warning</y-tag>
        <y-tag color="error" :bordered="false">Error</y-tag>
      </y-button-group>
    </y-card>

    <y-card title="自定义颜色" style="margin-top: 8px">
      <y-button-group>
        <y-tag color="#f50">#f50</y-tag>
        <y-tag color="#2db7f5">#2db7f5</y-tag>
        <y-tag color="#87d068">#87d068</y-tag>
        <y-tag color="#108ee9">#108ee9</y-tag>
        <y-tag color="#f50" closable>可关闭</y-tag>
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tags = ref(['标签一', '标签二', '标签三', '标签四'])

function handleClose(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function addTag() {
  const n = tags.value.length + 1
  tags.value.push(`标签${n}`)
}
</script>
