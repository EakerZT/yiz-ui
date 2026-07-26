<template>
  <div class="demo-tab-direction-control">
    <y-radio-button-group v-model:value="cardDirectionDemoDirection" size="small">
      <y-radio-button value="top">{{ $t('demo.tab.directionTop') }}</y-radio-button>
      <y-radio-button value="bottom" closable>{{ $t('demo.tab.directionBottom') }}</y-radio-button>
      <y-radio-button value="left" closable>{{ $t('demo.tab.directionLeft') }}</y-radio-button>
      <y-radio-button value="right" closable>{{ $t('demo.tab.directionRight') }}</y-radio-button>
    </y-radio-button-group>
  </div>
  <div class="demo-tab-direction-preview">
    <y-tab v-model:active="cardDirectionDemoTab" :direction="cardDirectionDemoDirection" type="card">
      <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
        <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
      </y-tab-pane>
      <y-tab-pane :label="$t('demo.tab.tab2')" key="b" closable>
        <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
      </y-tab-pane>
      <y-tab-pane :label="$t('demo.tab.tab3')" key="c" closable>
        <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
      </y-tab-pane>
    </y-tab>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

type TabDirection = 'top' | 'bottom' | 'left' | 'right'

const cardDirectionDemoDirection = ref<TabDirection>('top')

const cardDirectionDemoTab = ref('a')
</script>

<style>
.demo-tab-direction-control {
  margin-bottom: 12px;
}
.demo-tab-direction-preview {
  min-height: 160px;
}
</style>
