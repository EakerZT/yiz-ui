<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Drawer 抽屉</h2>
    <p class="demo-section-desc">从屏幕边缘滑出的浮层面板，常用于表单、详情展示等场景。</p>

    <div class="demo-row">
      <span class="demo-label">基础用法</span>
      <div class="demo-items">
        <y-button type="primary" @click="visible1 = true">打开抽屉</y-button>
        <y-drawer v-model="visible1" title="基础抽屉">
          <p>这里是抽屉内容区域。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">方向</span>
      <div class="demo-items">
        <y-button @click="openDrawer('left')">Left</y-button>
        <y-button @click="openDrawer('right')">Right</y-button>
        <y-button @click="openDrawer('top')">Top</y-button>
        <y-button @click="openDrawer('bottom')">Bottom</y-button>
        <y-drawer v-model="visible2" :title="`${placement} 抽屉`" :placement="placement">
          <p>从 {{ placement }} 方向滑出。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">无遮罩</span>
      <div class="demo-items">
        <y-button @click="visible3 = true">无遮罩</y-button>
        <y-drawer v-model="visible3" title="无遮罩" :mask="false">
          <p>没有遮罩层的抽屉。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">点击遮罩关闭</span>
      <div class="demo-items">
        <y-button @click="visible4 = true">点击遮罩关闭</y-button>
        <y-drawer v-model="visible4" title="点击遮罩关闭" :mask-closable="true">
          <p>点击遮罩即可关闭抽屉。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">隐藏关闭按钮</span>
      <div class="demo-items">
        <y-button @click="visible5 = true">隐藏关闭按钮</y-button>
        <y-drawer v-model="visible5" title="无关闭按钮" :closable="false">
          <p>没有关闭按钮，只能通过代码控制关闭。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义宽高</span>
      <div class="demo-items">
        <y-button @click="visible6 = true">width="500px"</y-button>
        <y-button @click="visible7 = true">height="300px"</y-button>
        <y-drawer v-model="visible6" title="自定义宽度" width="500px" placement="right">
          <p>宽度为 500px 的右侧抽屉。</p>
        </y-drawer>
        <y-drawer v-model="visible7" title="自定义高度" height="300px" placement="bottom">
          <p>高度为 300px 的底部抽屉。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">拖拽调整</span>
      <div class="demo-items">
        <y-button @click="visible11 = true">横向调整</y-button>
        <y-button @click="visible12 = true">竖向调整</y-button>
        <y-drawer v-model="visible11" title="横向调整宽度" :resize="true" resize-min="200px" resize-max="80%">
          <p>最小 200px，最大 80% 屏幕宽度。</p>
        </y-drawer>
        <y-drawer v-model="visible12" title="竖向调整高度" placement="bottom" :resize="true" resize-min="150px" resize-max="60%">
          <p>最小 150px，最大 60% 屏幕高度。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">页脚</span>
      <div class="demo-items">
        <y-button type="primary" @click="visible8 = true">带页脚</y-button>
        <y-drawer v-model="visible8" title="带页脚">
          <p>这是抽屉主体内容。</p>
          <p style="margin-top: 12px; color: #888">可以在这里放置表单或其他内容。</p>
          <template #footer>
            <div style="display: flex; gap: 12px; justify-content: flex-end">
              <y-button @click="visible8 = false">取消</y-button>
              <y-button type="primary" @click="visible8 = false">确定</y-button>
            </div>
          </template>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义标题</span>
      <div class="demo-items">
        <y-button @click="visible9 = true">自定义标题</y-button>
        <y-drawer v-model="visible9">
          <template #title>
            <span style="color: var(--yiz-color-primary)">自定义标题颜色</span>
          </template>
          <p>通过 title 插槽可以自定义标题内容。</p>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">二级抽屉</span>
      <div class="demo-items">
        <y-button @click="visible13 = true">二级抽屉</y-button>
        <y-drawer v-model="visible13" title="一级抽屉" width="500px">
          <p>这是一级抽屉的内容。</p>
          <div style="margin-top: 16px">
            <y-button type="primary" @click="visible14 = true">打开二级抽屉</y-button>
          </div>
          <y-drawer v-model="visible14" title="二级抽屉" width="360px">
            <p>这是在一级抽屉中弹出的二级抽屉。</p>
            <p style="margin-top: 8px; color: #888">二级抽屉遮罩覆盖一级抽屉。</p>
          </y-drawer>
        </y-drawer>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">close 事件</span>
      <div class="demo-items">
        <y-button @click="visible10 = true">打开</y-button>
        <span v-if="closeCount > 0" class="demo-item-hint">close 触发次数：{{ closeCount }}</span>
        <y-drawer v-model="visible10" title="close 事件" @close="closeCount++">
          <p>每次关闭时触发 close 事件。</p>
        </y-drawer>
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
const visible11 = ref(false)
const visible12 = ref(false)
const visible13 = ref(false)
const visible14 = ref(false)

const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const closeCount = ref(0)

function openDrawer(p: 'left' | 'right' | 'top' | 'bottom') {
  placement.value = p
  visible2.value = true
}
</script>
