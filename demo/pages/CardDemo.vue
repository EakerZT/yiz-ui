<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Card 卡片</h2>
    <p class="demo-section-desc">通用卡片容器，用于承载文字、图片等内容。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <Card title="卡片标题" style="width: 360px">
        <p>这是卡片的内容区域，可以放置任意内容。</p>
      </Card>
    </y-card>

    <y-card title="边框" style="margin-top: 8px">
      <y-button-group>
        <Card title="有边框" style="width: 300px">
          <p>默认带边框的卡片。</p>
        </Card>
        <Card title="无边框" :bordered="false" style="width: 300px">
          <p>无边框的卡片，适合浅色背景。</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card title="阴影" style="margin-top: 8px">
      <y-button-group>
        <Card title="Hover 阴影" shadow="hover" style="width: 280px">
          <p>鼠标悬停时显示阴影。</p>
        </Card>
        <Card title="始终阴影" shadow="always" style="width: 280px">
          <p>一直显示阴影。</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card title="尺寸" style="margin-top: 8px">
      <y-button-group>
        <Card title="默认尺寸" style="width: 280px">
          <p>默认大小的卡片。</p>
        </Card>
        <Card title="小尺寸" size="small" style="width: 280px">
          <p>紧凑的小卡片。</p>
        </Card>
      </y-button-group>
    </y-card>

    <y-card title="头部额外内容" style="margin-top: 8px">
      <Card title="用户列表" style="width: 400px">
        <template #extra>
          <span class="demo-link">更多</span>
        </template>
        <p>头部右侧可以放置额外操作。</p>
      </Card>
    </y-card>

    <y-card title="封面图" style="margin-top: 8px">
      <Card title="风景" style="width: 320px">
        <template #cover>
          <div class="demo-cover">封面图片区域</div>
        </template>
        <p>卡片可以包含封面图，适合展示文章、商品等。</p>
      </Card>
    </y-card>

    <y-card title="自定义标题" style="margin-top: 8px">
      <Card style="width: 360px">
        <template #title>
          <span style="color: var(--yiz-color-primary); font-weight: 600">自定义标题样式</span>
        </template>
        <p>通过 #title 插槽可以完全自定义标题区域。</p>
      </Card>
    </y-card>

    <y-card title="底部操作" style="margin-top: 8px">
      <Card title="确认操作" style="width: 360px">
        <p>确定要执行此操作吗？</p>
        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <y-button>取消</y-button>
            <y-button type="primary">确定</y-button>
          </div>
        </template>
      </Card>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { Card } from 'yiz-ui'
</script>

<style scoped>
.demo-cover {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.demo-link {
  color: var(--yiz-color-primary);
  cursor: pointer;
  font-size: 14px;
}
.demo-link:hover {
  text-decoration: underline;
}
</style>
