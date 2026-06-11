<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tab 标签页</h2>
    <p class="demo-section-desc">分隔内容上有关联但属于不同类别的数据集合。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <y-tab v-model:active="tab1">
        <y-tab-pane label="标签一" value="a">
          <p style="padding: 12px 0">标签一的内容</p>
        </y-tab-pane>
        <y-tab-pane label="标签二" value="b">
          <p style="padding: 12px 0">标签二的内容</p>
        </y-tab-pane>
        <y-tab-pane label="标签三" value="c">
          <p style="padding: 12px 0">标签三的内容</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
      <y-tab v-model:active="tab2">
        <y-tab-pane label="标签一" value="a">
          <p style="padding: 12px 0">内容一</p>
        </y-tab-pane>
        <y-tab-pane label="标签二（禁用）" value="b" disabled>
          <p style="padding: 12px 0">内容二</p>
        </y-tab-pane>
        <y-tab-pane label="标签三" value="c">
          <p style="padding: 12px 0">内容三</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <y-card title="更多标签" style="margin-top: 8px">
      <y-tab v-model:active="tab3">
        <y-tab-pane v-for="i in 6" :key="i" :label="`标签${i}`" :value="i">
          <p style="padding: 12px 0">标签{{ i }} 的内容</p>
        </y-tab-pane>
      </y-tab>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tab1 = ref('a')
const tab2 = ref('a')
const tab3 = ref(1)
</script>
