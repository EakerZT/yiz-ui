<template>
  <div class="demo-section">
    <h2 class="demo-section-title">Loading 加载</h2>
    <p class="demo-section-desc">页面或容器局部加载时使用的动画图标。</p>

    <!-- indicator 类型 -->
    <h3 class="demo-sub-title">Indicator 类型</h3>
    <div class="demo-row">
      <div class="demo-items" style="gap: 48px">
        <div class="demo-item-icon">
          <Loading />
          <em>google</em>
        </div>
        <div class="demo-item-icon">
          <Loading indicator="spin" />
          <em>ant</em>
        </div>
        <div class="demo-item-icon">
          <Loading indicator="think" />
          <em>microsoft</em>
        </div>
      </div>
    </div>

    <!-- 尺寸 -->
    <h3 class="demo-sub-title">尺寸</h3>
    <div class="demo-row">
      <div class="demo-items" style="gap: 24px">
        <div class="demo-item-icon">
          <Loading size="small" />
          <em>small</em>
        </div>
        <div class="demo-item-icon">
          <Loading />
          <em>default</em>
        </div>
        <div class="demo-item-icon">
          <Loading size="large" />
          <em>large</em>
        </div>
      </div>
    </div>

    <!-- 加载文案 -->
    <h3 class="demo-sub-title">加载文案</h3>
    <div class="demo-row">
      <div class="demo-items">
        <Loading tip="Loading..." />
      </div>
    </div>

    <!-- 容器模式 -->
    <h3 class="demo-sub-title">容器模式</h3>
    <div class="demo-row">
      <div class="demo-items">
        <Loading :loading="containerLoading" style="width: 100%">
          <div class="demo-loading-content">
            <h4>内容区域</h4>
            <p>这是被 loading 覆盖的内容区域。</p>
            <p>当 loading 状态为 true 时，内容会被遮罩覆盖。</p>
          </div>
        </Loading>
      </div>
    </div>
    <div class="demo-row">
      <button class="demo-btn" @click="containerLoading = !containerLoading">
        {{ containerLoading ? '停止' : '开始' }}加载
      </button>
    </div>

    <!-- 延迟显示 -->
    <h3 class="demo-sub-title">延迟显示</h3>
    <p class="demo-section-desc">设置 delay 可以避免接口响应过快时出现闪烁。</p>
    <div class="demo-row">
      <div class="demo-items">
        <Loading :loading="delayLoading" :delay="500" tip="延迟 500ms 显示" />
      </div>
    </div>
    <div class="demo-row">
      <button class="demo-btn" @click="delayLoading = !delayLoading">toggle（500ms delay）</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Loading } from 'yiz-ui'

const containerLoading = ref(true)
const delayLoading = ref(false)
</script>

<style scoped>
h3.demo-sub-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 28px;
  color: #444;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: var(--yiz-color-primary);
  color: var(--yiz-color-primary);
}

.demo-loading-content {
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
  min-height: 120px;
  line-height: 1.8;
  color: #666;
}

.demo-loading-content h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}
</style>
