<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Button 按钮</h2>
    <p class="demo-section-desc">
      支持 default / primary / plain 三种类型，多种预设颜色和自定义颜色，以及圆形、圆角形状。
    </p>

    <y-card title="基本">
      <y-button-group>
        <y-button>default</y-button>
        <y-button type="primary">primary</y-button>
        <y-button type="plain">plain</y-button>
      </y-button-group>
    </y-card>

    <y-card title="Color" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">default</y-button>
        <y-button type="primary" color="success">success</y-button>
        <y-button type="primary" color="warning">warning</y-button>
        <y-button type="primary" color="error">error</y-button>
      </y-button-group>
    </y-card>

    <y-card title="自定义色" style="margin-top: 8px">
      <y-button-group>
        <y-button color="#8a2be2">#8a2be2</y-button>
        <y-button type="primary" color="#8a2be2">#8a2be2</y-button>
        <y-button type="plain" color="#8a2be2">#8a2be2</y-button>
      </y-button-group>
    </y-card>

    <y-card title="Shape" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">default</y-button>
        <y-button type="primary" shape="round">round</y-button>
        <y-button type="primary" shape="circle">A</y-button>
      </y-button-group>
    </y-card>

    <y-card title="带图标" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary">
          <y-icon :icon="Flash20Regular" />
          Search
        </y-button>
        <y-button type="primary" shape="circle">
          <y-icon :icon="Flash20Regular" />
        </y-button>
      </y-button-group>
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-button-group>
        <y-button disabled>default</y-button>
        <y-button type="primary" disabled>primary</y-button>
        <y-button type="plain" disabled>plain</y-button>
      </y-button-group>
    </y-card>

    <y-card title="点击事件" style="margin-top: 8px">
      <y-button @click="count++">点击次数: {{ count }}</y-button>
    </y-card>

    <y-card title="Link 文字按钮" style="margin-top: 8px">
      <y-button-group>
        <y-link-button>primary</y-link-button>
        <y-link-button color="default">default</y-link-button>
        <y-link-button color="success">success</y-link-button>
        <y-link-button color="warning">warning</y-link-button>
        <y-link-button color="error">error</y-link-button>
      </y-button-group>
    </y-card>

    <y-card title="Link 自定义色" style="margin-top: 8px">
      <y-button-group>
        <y-link-button color="#8a2be2">#8a2be2</y-link-button>
        <y-link-button color="#ff6b35">#ff6b35</y-link-button>
      </y-button-group>
    </y-card>

    <y-card title="Link 下划线" style="margin-top: 8px">
      <y-link-button underline>hover 显示下划线</y-link-button>
    </y-card>

    <y-card title="Link 禁用" style="margin-top: 8px">
      <y-button-group>
        <y-link-button disabled>disabled</y-link-button>
        <y-link-button color="error" disabled>error disabled</y-link-button>
      </y-button-group>
    </y-card>

    <y-card title="Link 点击" style="margin-top: 8px">
      <y-link-button @click="linkCount++">点击次数: {{ linkCount }}</y-link-button>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

const count = ref(0)
const linkCount = ref(0)
</script>
