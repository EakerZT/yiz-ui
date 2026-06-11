<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tooltip 文字提示</h2>
    <p class="demo-section-desc">鼠标悬停时显示提示信息，支持上、下、左、右四个方向，content 支持 prop 和插槽两种方式。</p>

    <y-card title="方向" style="margin-top: 8px">
      <y-button-group>
        <y-tooltip content="这是提示文字" placement="top">
          <y-button>上方</y-button>
        </y-tooltip>
        <y-tooltip content="这是提示文字" placement="bottom">
          <y-button>下方</y-button>
        </y-tooltip>
        <y-tooltip content="这是提示文字" placement="left">
          <y-button>左侧</y-button>
        </y-tooltip>
        <y-tooltip content="这是提示文字" placement="right">
          <y-button>右侧</y-button>
        </y-tooltip>
      </y-button-group>
    </y-card>

    <y-card title="长文本" style="margin-top: 8px">
      <y-tooltip content="这是一段比较长的提示文字，用于测试 tooltip 在较长内容下的展示效果。" placement="top">
        <y-button type="primary">悬停查看</y-button>
      </y-tooltip>
    </y-card>

    <y-card title="内联元素" style="margin-top: 8px">
      <y-tooltip content="提示文字" placement="top">
        <span class="demo-link">鼠标悬停这里</span>
      </y-tooltip>
    </y-card>

    <y-card title="自定义内容" style="margin-top: 8px">
      <y-tooltip placement="top">
        <template #content>
          <span style="color: #f56c6c; font-weight: 600">红色加粗提示</span>
        </template>
        <y-button>自定义插槽</y-button>
      </y-tooltip>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.demo-link {
  color: var(--yiz-color-primary);
  cursor: pointer;
  font-size: 14px;
}
.demo-link:hover {
  text-decoration: underline;
}
</style>
