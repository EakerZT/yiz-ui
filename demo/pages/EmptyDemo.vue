<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Empty 空状态</h2>
    <p class="demo-section-desc">用于展示空数据或无结果时的占位提示。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <Empty />
    </y-card>

    <y-card title="自定义描述" style="margin-top: 8px">
      <Empty description="没有找到相关结果" />
    </y-card>

    <y-card title="小尺寸" style="margin-top: 8px">
      <Empty size="small" description="列表为空" />
    </y-card>

    <y-card title="自定义图片" style="margin-top: 8px">
      <Empty description="网络连接失败，请检查网络后重试">
        <template #image>
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#d9d9d9" stroke-width="2" />
            <path d="M20 44l24-24M20 20l24 24" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" />
          </svg>
        </template>
      </Empty>
    </y-card>

    <y-card title="带操作" style="margin-top: 8px">
      <Empty description="购物车是空的">
        <y-button type="primary" size="small">去逛逛</y-button>
      </Empty>
    </y-card>

    <y-card title="表格空状态" style="margin-top: 8px">
      <div style="border: 1px solid #d9d9d9; border-radius: 4px">
        <Empty description="暂无数据" size="small" />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { Empty } from 'yiz-ui'
</script>
