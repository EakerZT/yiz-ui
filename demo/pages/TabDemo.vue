<template>
  <div class="demo-section">
    <h2 class="demo-section-title">Tab 标签页</h2>
    <p class="demo-section-desc">分隔内容上有关联但属于不同类别的数据集合。</p>

    <h3>基础用法</h3>
    <y-tab v-model:active="tab1">
      <y-tab-pane label="标签一" value="a">
        <p>内容一</p>
      </y-tab-pane>
      <y-tab-pane label="标签二" value="b">
        <p>内容二</p>
      </y-tab-pane>
      <y-tab-pane label="标签三" value="c">
        <p>内容三</p>
      </y-tab-pane>
    </y-tab>

    <h3>禁用</h3>
    <y-tab v-model:active="tab2">
      <y-tab-pane label="标签一" value="a">
        <p>内容一</p>
      </y-tab-pane>
      <y-tab-pane label="标签二" value="b" disabled>
        <p>内容二（禁用）</p>
      </y-tab-pane>
      <y-tab-pane label="标签三" value="c">
        <p>内容三</p>
      </y-tab-pane>
    </y-tab>

    <h3>更多标签</h3>
    <y-tab v-model:active="tab3">
      <y-tab-pane v-for="i in 6" :key="i" :label="`标签${i}`" :value="i">
        <p>内容 {{ i }}</p>
      </y-tab-pane>
    </y-tab>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tab1 = ref('a')
const tab2 = ref('a')
const tab3 = ref(1)
</script>
