<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Loading 加载</h2>
    <p class="demo-section-desc">页面或容器局部加载时使用的动画图标。</p>

    <y-card title="Indicator 类型" style="margin-top: 8px">
      <y-button-group>
        <span class="demo-loading-item">
          <y-loading />
          <em>ring</em>
        </span>
        <span class="demo-loading-item">
          <y-loading indicator="spin" />
          <em>spin</em>
        </span>
        <span class="demo-loading-item">
          <y-loading indicator="think" />
          <em>think</em>
        </span>
      </y-button-group>
    </y-card>

    <y-card title="尺寸" style="margin-top: 8px">
      <y-button-group>
        <span class="demo-loading-item">
          <y-loading size="small" />
          <em>small</em>
        </span>
        <span class="demo-loading-item">
          <y-loading />
          <em>default</em>
        </span>
        <span class="demo-loading-item">
          <y-loading size="large" />
          <em>large</em>
        </span>
      </y-button-group>
    </y-card>

    <y-card title="加载文案" style="margin-top: 8px">
      <y-loading tip="Loading..." />
    </y-card>

    <y-card title="容器模式" style="margin-top: 8px">
      <y-loading :loading="containerLoading">
        <div class="demo-loading-content">
          <p>这是被包裹的内容区域</p>
          <p>加载中时会半透明且不可交互</p>
        </div>
      </y-loading>
      <div style="margin-top: 8px">
        <y-button size="small" @click="containerLoading = !containerLoading">
          {{ containerLoading ? '停止加载' : '开始加载' }}
        </y-button>
      </div>
    </y-card>

    <y-card title="延迟显示" style="margin-top: 8px">
      <y-loading :loading="delayLoading" :delay="500" tip="延迟 500ms 显示" />
      <div style="margin-top: 8px">
        <y-button size="small" @click="delayLoading = !delayLoading">
          {{ delayLoading ? '停止加载' : '开始加载' }}
        </y-button>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const containerLoading = ref(true)
const delayLoading = ref(false)
</script>

<style scoped>
.demo-loading-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.demo-loading-item em {
  font-style: normal;
  color: #bbb;
}
.demo-loading-content {
  padding: 20px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
</style>
