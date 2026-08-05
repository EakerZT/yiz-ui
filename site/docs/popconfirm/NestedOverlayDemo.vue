<template>
  <div class="popconfirm-nested-demo">
    <y-button @click="dialogOpen = true">{{ $t('demo.popconfirm.openDialog') }}</y-button>

    <y-popover :title="$t('demo.popconfirm.outerPopover')" :width="340" placement="bottom">
      <template #content>
        <div class="popconfirm-nested-content">
          <p>{{ $t('demo.popconfirm.outerPopoverHint') }}</p>
          <y-popconfirm :title="$t('demo.popconfirm.permissionTitle')" :width="300" placement="right">
            <template #description>
              <div class="popconfirm-permission-form">
                <span>{{ $t('demo.popconfirm.permissionDescription') }}</span>
                <y-select v-model:value="permission" :options="permissionOptions" />
              </div>
            </template>
            <y-button>{{ $t('demo.popconfirm.nestedConfirm') }}</y-button>
          </y-popconfirm>
        </div>
      </template>
      <y-button>{{ $t('demo.popconfirm.openPopover') }}</y-button>
    </y-popover>
  </div>

  <y-dialog v-model:show="dialogOpen" :title="$t('demo.popconfirm.dialogTitle')" disabled-footer>
    <div class="popconfirm-dialog-content">
      <p>{{ $t('demo.popconfirm.dialogHint') }}</p>
      <y-popconfirm :title="$t('demo.popconfirm.dialogConfirmTitle')" placement="bottom">
        <y-button color="error">{{ $t('demo.popconfirm.dialogAction') }}</y-button>
      </y-popconfirm>
    </div>
  </y-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const dialogOpen = ref(false)
const permission = ref('member')
const permissionOptions = computed(() => [
  { label: $t('demo.popover.nestedOptionMember'), value: 'member' },
  { label: $t('demo.popover.nestedOptionRole'), value: 'role' },
  { label: $t('demo.popover.nestedOptionDepartment'), value: 'department' },
])
</script>

<style scoped>
.popconfirm-nested-demo {
  display: flex;
  gap: 12px;
}
.popconfirm-nested-content,
.popconfirm-dialog-content,
.popconfirm-permission-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.popconfirm-permission-form {
  width: 100%;
  margin-top: 4px;
}
.popconfirm-permission-form :deep(.yiz-select) {
  width: 100%;
}
.popconfirm-nested-content p,
.popconfirm-dialog-content p {
  color: #666;
  line-height: 1.6;
}
</style>
