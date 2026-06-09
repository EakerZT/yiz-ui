<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tooltip 文字提示</h2>
    <p class="demo-section-desc">鼠标悬停时显示提示信息，支持上、下、左、右四个方向，content 支持 prop 和插槽两种方式。</p>

    <div class="demo-row">
      <span class="demo-label">上方</span>
      <div class="demo-items">
        <y-tooltip content="这是提示文字" placement="top">
          <y-button>top</y-button>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">下方</span>
      <div class="demo-items">
        <y-tooltip content="这是提示文字" placement="bottom">
          <y-button>bottom</y-button>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">左侧</span>
      <div class="demo-items">
        <y-tooltip content="这是提示文字" placement="left">
          <y-button>left</y-button>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">右侧</span>
      <div class="demo-items">
        <y-tooltip content="这是提示文字" placement="right">
          <y-button>right</y-button>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">长文本</span>
      <div class="demo-items">
        <y-tooltip content="这是一段比较长的提示文字，用于测试 tooltip 在长文本下的表现" placement="top">
          <y-button type="primary">长文本提示</y-button>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">内联元素</span>
      <div class="demo-items">
        <y-tooltip content="提示文字" placement="top">
          <span style="color: var(--yiz-color-primary); cursor: pointer; border-bottom: 1px dashed var(--yiz-color-primary);">悬停这里</span>
        </y-tooltip>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <y-tooltip placement="top">
          <y-button>自定义内容</y-button>
          <template #content>
            <span style="color: #e6a23c">自定义插槽内容</span>
          </template>
        </y-tooltip>
      </div>
    </div>
  </section>
</template>
