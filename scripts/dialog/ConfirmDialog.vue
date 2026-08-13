<template>
  <Dialog
    v-model:show="visible"
    :width="width"
    :closable="closable"
    :mask="mask"
    :mask-closable="maskClosable"
    :esc-closable="escClosable"
    :modal-layer-parent="modalLayerParent"
    disabled-header
    disabled-footer
    @close="handleCancel"
    @after-leave="handleAfterLeave"
  >
    <div class="yiz-dialog-confirm">
      <div v-if="showIcon" class="yiz-dialog-confirm-icon">
        <component :is="iconNode" />
      </div>
      <div class="yiz-dialog-confirm-content">
        <div v-if="title || $slots.title" class="yiz-dialog-confirm-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="content || $slots.default" class="yiz-dialog-confirm-message">
          <slot>{{ content }}</slot>
        </div>
        <div class="yiz-dialog-confirm-actions">
          <Button v-if="showCancel" @click="handleCancel">{{ cancelText }}</Button>
          <Button
            type="primary"
            :color="okButtonColor"
            :text-color="okButtonTextColor"
            :loading="confirmLoading"
            @click="handleOk"
          >
            {{ okText }}
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, h, ref } from 'vue'
import { CheckmarkCircle24Regular, DismissCircle24Regular, Info24Regular, Warning24Regular } from '@vicons/fluent'
import { Button } from '../button'
import { Icon } from '../icon'
import { useLocale } from '../locale'
import type { ModalLayerContext } from '../overlay/modalLayer'
import Dialog from './Dialog.vue'

const t = useLocale()

type ConfirmType = 'confirm' | 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    type?: ConfirmType
    width?: string
    okText?: string
    cancelText?: string
    okButtonColor?: 'default' | 'success' | 'warning' | 'error' | string
    okButtonTextColor?: string
    showCancel?: boolean
    showIcon?: boolean
    icon?: Component
    closable?: boolean
    mask?: boolean
    maskClosable?: boolean
    escClosable?: boolean
    modalLayerParent?: ModalLayerContext | null
    onOk?: () => boolean | void | Promise<boolean | void>
    onCancel?: () => void
  }>(),
  {
    title: '',
    content: '',
    type: 'confirm',
    width: '420px',
    okText: undefined,
    cancelText: undefined,
    okButtonColor: 'default',
    showCancel: true,
    showIcon: true,
    closable: false,
    mask: true,
    maskClosable: false,
    escClosable: true,
    modalLayerParent: null,
  },
)

defineSlots<{
  default?: any
  title?: any
}>()

const emit = defineEmits<{
  closed: []
}>()

const visible = defineModel<boolean>('show', { default: false })
const confirmLoading = ref(false)

const okText = computed(() => props.okText ?? t('common.confirm'))
const cancelText = computed(() => props.cancelText ?? t('common.cancel'))

const iconMap: Record<ConfirmType, Component> = {
  confirm: Warning24Regular,
  info: Info24Regular,
  success: CheckmarkCircle24Regular,
  warning: Warning24Regular,
  error: DismissCircle24Regular,
}

const iconColorMap: Record<ConfirmType, string> = {
  confirm: 'var(--yiz-color-warning)',
  info: 'var(--yiz-color-primary)',
  success: 'var(--yiz-color-success)',
  warning: 'var(--yiz-color-warning)',
  error: 'var(--yiz-color-error)',
}

const iconNode = computed(() =>
  h(Icon, {
    icon: props.icon ?? iconMap[props.type],
    size: 24,
    style: { color: iconColorMap[props.type] },
  }),
)

function close() {
  visible.value = false
}

function handleAfterLeave() {
  emit('closed')
}

function handleCancel() {
  if (confirmLoading.value) return
  props.onCancel?.()
  close()
}

async function handleOk() {
  if (confirmLoading.value) return
  const result = props.onOk?.()
  if (result instanceof Promise) {
    confirmLoading.value = true
    try {
      const resolved = await result
      if (resolved !== false) {
        close()
      }
    } finally {
      confirmLoading.value = false
    }
    return
  }
  if (result !== false) {
    close()
  }
}
</script>

<style lang="less">
.yiz-dialog-confirm {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.yiz-dialog-confirm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding-top: 1px;
}

.yiz-dialog-confirm-content {
  flex: 1;
  min-width: 0;
}

.yiz-dialog-confirm-title {
  color: var(--yiz-color-text-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: var(--yiz-control-height-small);
}

.yiz-dialog-confirm-message {
  margin-top: 8px;
  color: var(--yiz-color-text-secondary);
  font-size: 14px;
  line-height: 22px;
  word-break: break-word;
}

.yiz-dialog-confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
