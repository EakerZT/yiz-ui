<template>
  <Popover
    v-model:open="popoverOpen"
    :placement="placement"
    :disabled="disabled"
    :width="width"
    :show-arrow="showArrow"
    trigger="click"
  >
    <template #content>
      <div
        class="yiz-popconfirm"
        role="alertdialog"
        :aria-labelledby="titleId"
        :aria-describedby="hasDescription ? descriptionId : undefined"
      >
        <div class="yiz-popconfirm-message">
          <span class="yiz-popconfirm-icon" aria-hidden="true">
            <slot name="icon"><Icon :icon="Warning20Filled" size="20" /></slot>
          </span>
          <div class="yiz-popconfirm-message-content">
            <div :id="titleId" class="yiz-popconfirm-title">
              <slot name="title">{{ title || t('popconfirm.title') }}</slot>
            </div>
            <div v-if="hasDescription" :id="descriptionId" class="yiz-popconfirm-description">
              <slot name="description">{{ description }}</slot>
            </div>
          </div>
        </div>
        <div class="yiz-popconfirm-actions">
          <Button size="small" :disabled="busy" @click="onCancel">
            <slot name="cancel">{{ cancelText || t('common.cancel') }}</slot>
          </Button>
          <Button size="small" type="primary" :color="confirmColor" :loading="busy" @click="onConfirm">
            <slot name="confirm">{{ confirmText || t('common.confirm') }}</slot>
          </Button>
        </div>
      </div>
    </template>
    <slot />
  </Popover>
</template>

<script lang="ts" setup>
import { computed, ref, useId, useSlots, watch } from 'vue'
import { Warning20Filled } from '@vicons/fluent'
import { Button } from '../button'
import { Icon } from '../icon'
import { useLocale } from '../locale'
import { Popover } from '../popover'

const t = useLocale()

export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    /**
     * 确认标题。
     * @en Confirmation title.
     */
    title?: string
    /**
     * 补充说明。
     * @en Additional description.
     */
    description?: string
    /**
     * 弹出位置。
     * @en Popup placement.
     */
    placement?: PopconfirmPlacement
    /**
     * 是否禁用。
     * @en Whether the popconfirm is disabled.
     */
    disabled?: boolean
    /**
     * 弹出层宽度。
     * @en Popup width.
     */
    width?: string | number
    /**
     * 是否显示箭头。
     * @en Whether to show the arrow.
     */
    showArrow?: boolean
    /**
     * 确认按钮文字。
     * @en Confirm button text.
     */
    confirmText?: string
    /**
     * 取消按钮文字。
     * @en Cancel button text.
     */
    cancelText?: string
    /**
     * 确认按钮颜色。
     * @en Confirm button color.
     */
    confirmColor?: 'default' | 'success' | 'warning' | 'error' | string
    /**
     * 外部控制的确认加载状态。
     * @en Externally controlled loading state of the confirm button.
     */
    confirmLoading?: boolean
    /**
     * 确认前执行的守卫，返回 false 时保持打开；Promise 执行期间自动显示加载状态。
     * @en Guard invoked before confirmation. Returning false keeps the popup open; promises enable loading automatically.
     */
    beforeConfirm?: () => boolean | void | Promise<boolean | void>
  }>(),
  {
    title: '',
    description: '',
    placement: 'top',
    disabled: false,
    width: 280,
    showArrow: true,
    confirmText: '',
    cancelText: '',
    confirmColor: 'default',
    confirmLoading: false,
  },
)

const slots = useSlots()

defineSlots<{
  /**
   * 触发元素，只使用第一个有效节点且不增加包裹元素。
   * @en Trigger element. Only the first valid node is used without adding a wrapper.
   */
  default?: () => any
  /**
   * 自定义标题。
   * @en Custom title.
   */
  title?: any
  /**
   * 自定义说明。
   * @en Custom description.
   */
  description?: any
  /**
   * 自定义图标。
   * @en Custom icon.
   */
  icon?: any
  /**
   * 自定义取消按钮内容。
   * @en Custom cancel button content.
   */
  cancel?: any
  /**
   * 自定义确认按钮内容。
   * @en Custom confirm button content.
   */
  confirm?: any
}>()

const emit = defineEmits<{
  /**
   * 确认成功后触发。
   * @en Emitted after confirmation succeeds.
   */
  confirm: []
  /**
   * 点击取消按钮时触发。
   * @en Emitted when the cancel button is clicked.
   */
  cancel: []
  /**
   * 确认守卫抛出错误或 Promise 被拒绝时触发。
   * @en Emitted when the confirmation guard throws or rejects.
   */
  confirmError: [error: unknown]
  /**
   * 打开状态变化时触发。
   * @en Emitted when the open state changes.
   */
  openChange: [open: boolean]
}>()

/**
 * 弹出层是否打开。
 * @en Whether the popup is open.
 */
const open = defineModel<boolean>('open', { default: false })

const titleId = `yiz-popconfirm-title-${useId()}`
const descriptionId = `yiz-popconfirm-description-${useId()}`
const internalLoading = ref(false)
const busy = computed(() => props.confirmLoading || internalLoading.value)
const hasDescription = computed(() => Boolean(props.description || slots.description))
const popoverOpen = computed({
  get: () => open.value,
  set: (value: boolean) => {
    if (!value && busy.value) return
    open.value = value
  },
})

async function onConfirm() {
  if (busy.value) return
  try {
    if (props.beforeConfirm) {
      internalLoading.value = true
      const result = await props.beforeConfirm()
      if (result === false) return
    }
    emit('confirm')
    open.value = false
  } catch (error) {
    emit('confirmError', error)
  } finally {
    internalLoading.value = false
  }
}

function onCancel() {
  if (busy.value) return
  emit('cancel')
  open.value = false
}

watch(open, (value) => emit('openChange', value))

defineExpose({
  /**
   * 打开确认框。
   * @en Opens the confirmation popup.
   */
  open: () => {
    if (!props.disabled) open.value = true
  },
  /**
   * 关闭确认框。
   * @en Closes the confirmation popup.
   */
  close: () => {
    if (!busy.value) open.value = false
  },
})
</script>

<style lang="less">
.yiz-popconfirm {
  color: var(--yiz-color-text-primary);
}

.yiz-popconfirm-message {
  display: flex;
  align-items: flex-start;
  gap: var(--yiz-space-2);
}

.yiz-popconfirm-icon {
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--yiz-color-warning);
}

.yiz-popconfirm-message-content {
  min-width: 0;
  flex: 1;
}

.yiz-popconfirm-title {
  color: var(--yiz-color-text-primary);
  font-weight: var(--yiz-font-weight-medium);
  line-height: 22px;
  word-break: break-word;
}

.yiz-popconfirm-description {
  margin-top: 4px;
  color: var(--yiz-color-text-secondary);
  font-size: 13px;
  line-height: 20px;
  word-break: break-word;
}

.yiz-popconfirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--yiz-space-2);
  margin-top: var(--yiz-space-3);
}
</style>
