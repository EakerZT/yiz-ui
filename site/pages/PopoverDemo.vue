<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.popover.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.popover.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-popover :title="$t('demo.popover.basicTitle')" :content="$t('demo.popover.basicContent')">
        <y-button type="primary">{{ $t('demo.popover.clickMe') }}</y-button>
      </y-popover>
    </y-card>

    <y-card :title="$t('demo.common.placement')" style="margin-top: 8px">
      <y-button-group>
        <y-popover v-for="placement in placements" :key="placement" :placement="placement" :content="placement">
          <y-button>{{ placement }}</y-button>
        </y-popover>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.popover.trigger')" style="margin-top: 8px">
      <y-button-group>
        <y-popover trigger="click" :content="$t('demo.popover.clickContent')">
          <y-button>{{ $t('demo.popover.click') }}</y-button>
        </y-popover>
        <y-popover trigger="hover" :content="$t('demo.popover.hoverContent')">
          <y-button>{{ $t('demo.popover.hover') }}</y-button>
        </y-popover>
        <y-popover trigger="focus" :content="$t('demo.popover.focusContent')">
          <y-button>{{ $t('demo.popover.focus') }}</y-button>
        </y-popover>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-popover :width="1200">
        <template #title>{{ $t('demo.popover.customTitle') }}</template>
        <template #content>
          <div class="demo-popover-content">
            <p>{{ $t('demo.popover.customContent') }}</p>
            <div class="demo-popover-actions">
              <y-button size="small">{{ $t('demo.common.cancel') }}</y-button>
              <y-button size="small" type="primary">{{ $t('demo.common.confirm') }}</y-button>
            </div>
          </div>
        </template>
        <y-button>{{ $t('demo.common.customSlot') }}</y-button>
      </y-popover>
    </y-card>

    <y-card :title="$t('demo.popover.nestedOverlay')" style="margin-top: 8px">
      <y-popover :width="320">
        <template #title>{{ $t('demo.popover.nestedTitle') }}</template>
        <template #content>
          <div class="demo-popover-content">
            <p>{{ $t('demo.popover.nestedContent') }}</p>
            <y-select v-model:value="nestedValue" :options="nestedOptions" />
          </div>
        </template>
        <y-button>{{ $t('demo.popover.nestedButton') }}</y-button>
      </y-popover>
    </y-card>

    <y-card :title="$t('demo.common.controlled')" style="margin-top: 8px">
      <div class="demo-popover-row">
        <y-switch v-model:checked="controlledOpen" />
        <y-popover v-model:open="controlledOpen" :content="$t('demo.popover.controlledContent')">
          <y-button>{{ $t('demo.popover.controlledButton') }}</y-button>
        </y-popover>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

const placements: PopoverPlacement[] = ['top', 'bottom', 'left', 'right']
const controlledOpen = ref(false)
const nestedValue = ref('member')
const nestedOptions = computed(() => [
  { label: $t('demo.popover.nestedOptionMember'), value: 'member' },
  { label: $t('demo.popover.nestedOptionRole'), value: 'role' },
  { label: $t('demo.popover.nestedOptionDepartment'), value: 'department' },
])
</script>

<style scoped>
.demo-popover-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.demo-popover-row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
</style>
