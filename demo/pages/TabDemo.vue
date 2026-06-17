<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tab') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tab.desc') }}</p>

    <!-- 基础用法 -->
    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-tab v-model:active="tab1">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- 禁用 -->
    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-tab v-model:active="tab2">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.content1') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2Disabled')" key="b" disabled>
          <p style="padding: 12px 0">{{ $t('demo.tab.content2') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.content3') }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- 更多标签 -->
    <y-card :title="$t('demo.tab.moreTabs')" style="margin-top: 8px">
      <y-tab v-model:active="tab3">
        <y-tab-pane v-for="i in 6" :key="i" :label="$t('demo.tab.tabN', { index: i })">
          <p style="padding: 12px 0">{{ $t('demo.tab.tabNContent', { index: i }) }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- 自定义 label -->
    <y-card :title="'自定义 label / 图标'" style="margin-top: 8px">
      <y-tab v-model:active="customLabelTab">
        <y-tab-pane key="a">
          <template #label>🏠 首页</template>
          <p style="padding: 12px 0">首页内容</p>
        </y-tab-pane>
        <y-tab-pane key="b">
          <template #label>⚙️ 设置</template>
          <p style="padding: 12px 0">设置内容</p>
        </y-tab-pane>
        <y-tab-pane key="c">
          <template #label>👤 用户</template>
          <p style="padding: 12px 0">用户内容</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- 方向 -->
    <y-card :title="$t('demo.tab.directions')" style="margin-top: 16px">
      <y-tab v-model:active="dirTab" direction="top" style="margin-bottom: 16px">
        <y-tab-pane :label="$t('demo.tab.directionTop')" key="top">
          <p style="padding: 12px 0">{{ $t('demo.tab.contentTop') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.directionBottom')" key="bottom">
          <p style="padding: 12px 0">{{ $t('demo.tab.contentBottom') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.directionLeft')" key="left">
          <p style="padding: 12px 0">{{ $t('demo.tab.contentLeft') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.directionRight')" key="right">
          <p style="padding: 12px 0">{{ $t('demo.tab.contentRight') }}</p>
        </y-tab-pane>
      </y-tab>

      <y-tab v-model:active="dirTab2" direction="bottom" style="margin-bottom: 16px">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.contentBottom') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.content2') }}</p>
        </y-tab-pane>
      </y-tab>

      <div style="display: flex; gap: 16px">
        <y-tab v-model:active="dirTab3" direction="left" style="min-height: 120px">
          <y-tab-pane :label="$t('demo.tab.directionLeft')" key="left">
            <p style="padding: 12px 0">{{ $t('demo.tab.contentLeft') }}</p>
          </y-tab-pane>
          <y-tab-pane :label="$t('demo.tab.directionRight')" key="right">
            <p style="padding: 12px 0">{{ $t('demo.tab.contentRight') }}</p>
          </y-tab-pane>
        </y-tab>

        <y-tab v-model:active="dirTab4" direction="right" style="min-height: 120px">
          <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
            <p style="padding: 12px 0">{{ $t('demo.tab.content1') }}</p>
          </y-tab-pane>
          <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
            <p style="padding: 12px 0">{{ $t('demo.tab.content2') }}</p>
          </y-tab-pane>
        </y-tab>
      </div>
    </y-card>

    <!-- 卡片类型 -->
    <y-card :title="$t('demo.tab.cardType')" style="margin-top: 16px">
      <y-tab v-model:active="cardTab" type="card" @close="onCardClose">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" key="c" closable>
          <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tabN', { index: 4 })" key="d" closable>
          <p style="padding: 12px 0">{{ $t('demo.tab.tabNContent', { index: 4 }) }}</p>
        </y-tab-pane>
      </y-tab>
      <p v-if="cardCloseMsg" style="margin-top: 8px; color: #999; font-size: 13px">{{ cardCloseMsg }}</p>
    </y-card>

    <!-- 切换动画 -->
    <y-card :title="$t('demo.tab.transitions')" style="margin-top: 16px">
      <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.tab.fadeTransition') }}</p>
      <y-tab v-model:active="fadeTab" transition-type="fade">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
        </y-tab-pane>
      </y-tab>

      <p style="font-size: 13px; color: #999; margin-bottom: 8px; margin-top: 16px">
        {{ $t('demo.tab.slideTransition') }}
      </p>
      <y-tab v-model:active="slideTab" transition-type="slide">
        <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- Flex 弹性布局 -->
    <y-card :title="$t('demo.tab.flexMode')" style="margin-top: 16px">
      <div style="height: 200px; border: 1px dashed #d9d9d9; border-radius: 4px">
        <y-tab v-model:active="flexTab" flex overflow="auto">
          <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
            <p style="padding: 12px">{{ $t('demo.tab.tab1Content') }}</p>
            <p style="padding: 0 12px; color: #999; font-size: 13px">内容区自动填充剩余空间，超出时出现滚动条。</p>
            <div v-for="i in 20" :key="i" style="padding: 4px 12px; font-size: 13px; color: #bbb">
              演示行 {{ i }} — 测试 overflow-y 滚动
            </div>
          </y-tab-pane>
          <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
            <p style="padding: 12px">{{ $t('demo.tab.tab2Content') }}</p>
          </y-tab-pane>
        </y-tab>
      </div>
    </y-card>

    <!-- 溢出滚动 -->
    <y-card :title="$t('demo.tab.overflowTabs')" style="margin-top: 16px">
      <y-tab v-model:active="overflowTab">
        <y-tab-pane v-for="i in 15" :key="i" :label="$t('demo.tab.tabN', { index: i })">
          <p style="padding: 12px 0">{{ $t('demo.tab.tabNContent', { index: i }) }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <!-- 额外插槽 -->
    <y-card :title="$t('demo.tab.extraSlots')" style="margin-top: 16px">
      <y-tab v-model:active="extraTab">
        <template #leftExtra>
          <y-button size="small" @click="addExtraTab">{{ $t('demo.tab.addTab') }}</y-button>
        </template>
        <template #rightExtra>
          <span style="font-size: 13px; color: #999">共 {{ extraCount }} 项</span>
        </template>
        <y-tab-pane v-for="i in extraCount" :key="i" :label="$t('demo.tab.tabN', { index: i })">
          <p style="padding: 12px 0">{{ $t('demo.tab.tabNContent', { index: i }) }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const tab1 = ref('a')
const tab2 = ref('a')
const tab3 = ref(1)

const customLabelTab = ref('a')

const dirTab = ref('top')
const dirTab2 = ref('a')
const dirTab3 = ref('left')
const dirTab4 = ref('a')

const cardTab = ref('a')
const cardCloseMsg = ref('')
function onCardClose(value: any) {
  cardCloseMsg.value = $t('demo.tab.cardCloseEvent', { value })
}

const fadeTab = ref('a')
const slideTab = ref('a')

const flexTab = ref('a')

const overflowTab = ref(1)

const extraTab = ref(1)
const extraCount = ref(4)
function addExtraTab() {
  extraCount.value++
}
</script>
