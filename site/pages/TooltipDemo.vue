<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.tooltip.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tooltip.desc') }}</p>

    <y-card :title="$t('demo.common.placement')" style="margin-top: 8px">
      <y-button-group>
        <y-tooltip :content="$t('demo.tooltip.tipText')" placement="top">
          <y-button>{{ $t('demo.tooltip.top') }}</y-button>
        </y-tooltip>
        <y-tooltip :content="$t('demo.tooltip.tipText')" placement="bottom">
          <y-button>{{ $t('demo.tooltip.bottom') }}</y-button>
        </y-tooltip>
        <y-tooltip :content="$t('demo.tooltip.tipText')" placement="left">
          <y-button>{{ $t('demo.tooltip.left') }}</y-button>
        </y-tooltip>
        <y-tooltip :content="$t('demo.tooltip.tipText')" placement="right">
          <y-button>{{ $t('demo.tooltip.right') }}</y-button>
        </y-tooltip>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.tooltip.longText')" style="margin-top: 8px">
      <y-tooltip :content="$t('demo.tooltip.longTip')" placement="top">
        <y-button type="primary">{{ $t('demo.tooltip.hoverToView') }}</y-button>
      </y-tooltip>
    </y-card>

    <y-card :title="$t('demo.tooltip.inline')" style="margin-top: 8px">
      <y-tooltip :content="$t('demo.tooltip.tipHint')" placement="top">
        <span class="demo-link">{{ $t('demo.tooltip.hoverHere') }}</span>
      </y-tooltip>
    </y-card>

    <y-card :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-tooltip placement="top">
        <template #content>
          <span style="color: #f56c6c; font-weight: 600">{{ $t('demo.tooltip.redBoldTip') }}</span>
        </template>
        <y-button>{{ $t('demo.common.customSlot') }}</y-button>
      </y-tooltip>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
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
