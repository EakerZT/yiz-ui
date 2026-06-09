<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Button 按钮</h2>
    <p class="demo-section-desc">
      支持 default / primary / plain 三种类型，多种预设颜色和自定义颜色，以及圆形、圆角形状。
    </p>

    <div class="demo-row">
      <span class="demo-label">Type</span>
      <div class="demo-items">
        <span class="demo-item"><y-button>default</y-button></span>
        <span class="demo-item"><y-button type="primary">primary</y-button></span>
        <span class="demo-item"><y-button type="plain">plain</y-button></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Color</span>
      <div class="demo-items">
        <span class="demo-item"><y-button type="primary">default</y-button></span>
        <span class="demo-item"><y-button type="primary" color="success">success</y-button></span>
        <span class="demo-item"><y-button type="primary" color="warning">warning</y-button></span>
        <span class="demo-item"><y-button type="primary" color="error">error</y-button></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义色</span>
      <div class="demo-items">
        <span class="demo-item"><y-button color="#8a2be2">#8a2be2</y-button></span>
        <span class="demo-item"><y-button type="primary" color="#8a2be2">#8a2be2</y-button></span>
        <span class="demo-item"><y-button type="plain" color="#8a2be2">#8a2be2</y-button></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Shape</span>
      <div class="demo-items">
        <span class="demo-item"><y-button type="primary">default</y-button></span>
        <span class="demo-item"><y-button type="primary" shape="round">round</y-button></span>
        <span class="demo-item"><y-button type="primary" shape="circle">A</y-button></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">带图标</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-button type="primary">
            <y-icon :icon="Flash20Regular" />
            Search
          </y-button>
        </span>
        <span class="demo-item">
          <y-button type="primary" shape="circle">
            <y-icon :icon="Flash20Regular" />
          </y-button>
        </span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <span class="demo-item"><y-button disabled>default</y-button></span>
        <span class="demo-item"><y-button type="primary" disabled>primary</y-button></span>
        <span class="demo-item"><y-button type="plain" disabled>plain</y-button></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">点击事件</span>
      <div class="demo-items">
        <span class="demo-item"
          ><y-button @click="count++">点击次数: {{ count }}</y-button></span
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

const count = ref(0)
</script>
