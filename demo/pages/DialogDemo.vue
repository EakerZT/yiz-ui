<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Dialog 弹窗</h2>
    <p class="demo-section-desc">模态对话框，用于重要信息的提示或操作确认。</p>

    <div class="demo-row">
      <span class="demo-label">基础用法</span>
      <div class="demo-items">
        <y-button type="primary" @click="visible1 = true">打开弹窗</y-button>
        <y-dialog v-model="visible1" title="基础弹窗">
          <p>这是弹窗内容区域。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">拖动</span>
      <div class="demo-items">
        <y-button @click="visible10 = true">可拖动弹窗</y-button>
        <y-dialog v-model="visible10" title="拖动标题移动" :drag="true">
          <p>拖拽标题栏可以移动弹窗位置。</p>
          <p style="margin-top: 8px; color: #888">弹窗不会被拖出屏幕外，视口变化时自动修正位置。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义宽度</span>
      <div class="demo-items">
        <y-button @click="visible2 = true">width="600px"</y-button>
        <y-button @click="visible3 = true">width="300px"</y-button>
        <y-dialog v-model="visible2" title="宽弹窗" width="600px">
          <p>宽度为 600px 的弹窗。</p>
        </y-dialog>
        <y-dialog v-model="visible3" title="窄弹窗" width="300px">
          <p>宽度为 300px 的弹窗。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">无遮罩</span>
      <div class="demo-items">
        <y-button @click="visible4 = true">无遮罩</y-button>
        <y-dialog v-model="visible4" title="无遮罩" :mask="false">
          <p>没有遮罩层的弹窗。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">点击遮罩关闭</span>
      <div class="demo-items">
        <y-button @click="visible5 = true">点击遮罩关闭</y-button>
        <y-dialog v-model="visible5" title="点击遮罩关闭" :mask-closable="true">
          <p>点击遮罩即可关闭弹窗。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">隐藏关闭按钮</span>
      <div class="demo-items">
        <y-button @click="visible6 = true">隐藏关闭按钮</y-button>
        <y-dialog v-model="visible6" title="无关闭按钮" :closable="false">
          <p>没有关闭按钮和遮罩关闭，只能通过代码控制关闭。</p>
          <div style="margin-top: 16px">
            <y-button type="primary" @click="visible6 = false">关闭弹窗</y-button>
          </div>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">页脚</span>
      <div class="demo-items">
        <y-button type="primary" @click="visible7 = true">确认弹窗</y-button>
        <y-dialog v-model="visible7" title="确认操作">
          <p>确定要执行此操作吗？</p>
          <template #footer>
            <div style="display: flex; gap: 12px; justify-content: flex-end">
              <y-button @click="visible7 = false">取消</y-button>
              <y-button type="primary" @click="visible7 = false">确定</y-button>
            </div>
          </template>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义标题</span>
      <div class="demo-items">
        <y-button @click="visible8 = true">自定义标题</y-button>
        <y-dialog v-model="visible8">
          <template #title>
            <span style="color: var(--yiz-color-primary)">自定义标题颜色</span>
          </template>
          <p>通过 title 插槽可以自定义标题内容。</p>
        </y-dialog>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">close 事件</span>
      <div class="demo-items">
        <y-button @click="visible9 = true">打开</y-button>
        <span v-if="closeCount > 0" class="demo-item-hint">close 触发次数：{{ closeCount }}</span>
        <y-dialog v-model="visible9" title="close 事件" @close="closeCount++">
          <p>每次关闭时触发 close 事件。</p>
        </y-dialog>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const visible4 = ref(false)
const visible5 = ref(false)
const visible6 = ref(false)
const visible7 = ref(false)
const visible8 = ref(false)
const visible9 = ref(false)
const visible10 = ref(false)

const closeCount = ref(0)
</script>
