import { createVNode, getCurrentInstance, render, type Component, type VNodeChild } from 'vue'
import {
  applyServiceTheme,
  resolveServiceTarget,
  useServiceContext,
  withServiceContext,
  type ServiceContext,
} from '../app/serviceContext'
import { getModalLayer, injectModalLayer, type ModalLayerContext } from '../overlay/modalLayer'
import ConfirmDialog from './ConfirmDialog.vue'

export type DialogConfirmType = 'confirm' | 'info' | 'success' | 'warning' | 'error'

export interface DialogConfirmOptions {
  title?: string | VNodeChild
  content?: string | VNodeChild
  type?: DialogConfirmType
  width?: string
  okText?: string
  cancelText?: string
  okButtonColor?: 'default' | 'success' | 'warning' | 'error' | string
  showCancel?: boolean
  showIcon?: boolean
  icon?: Component
  closable?: boolean
  mask?: boolean
  maskClosable?: boolean
  onOk?: () => boolean | void | Promise<boolean | void>
  onCancel?: () => void
}

export interface DialogConfirmHandle {
  close: () => void
  destroy: () => void
  update: (options: DialogConfirmOptions) => void
}

export interface DialogApi {
  confirm: (options?: DialogConfirmOptions) => DialogConfirmHandle
}

const DESTROY_DELAY = 360

export function useDialog(): DialogApi {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useDialog() must be called in setup().')
  }

  const modalLayer = getModalLayer(instance) ?? injectModalLayer()
  const context = useServiceContext()

  return {
    confirm: (options: DialogConfirmOptions = {}) => openConfirm(options, modalLayer, context),
  }
}

function openConfirm(
  options: DialogConfirmOptions = {},
  modalLayerParent: ModalLayerContext | null = null,
  context?: ServiceContext,
): DialogConfirmHandle {
  const container = document.createElement('div')
  let state: DialogConfirmOptions & { show: boolean } = {
    ...options,
    show: true,
  }
  let destroyed = false
  let destroyTimer: ReturnType<typeof setTimeout> | null = null

  applyServiceTheme(container, context)
  resolveServiceTarget(context).appendChild(container)

  function clearDestroyTimer() {
    if (destroyTimer) {
      clearTimeout(destroyTimer)
      destroyTimer = null
    }
  }

  function destroy() {
    if (destroyed) return
    destroyed = true
    clearDestroyTimer()
    render(null, container)
    container.remove()
  }

  function close() {
    if (destroyed) return
    if (state.show) {
      state.show = false
      renderConfirm()
    }
    clearDestroyTimer()
    destroyTimer = setTimeout(destroy, DESTROY_DELAY)
  }

  function update(nextOptions: DialogConfirmOptions) {
    if (destroyed) return
    state = {
      ...state,
      ...nextOptions,
    }
    renderConfirm()
  }

  function renderConfirm() {
    const title = state.title
    const content = state.content
    const titleSlot = typeof title === 'string' || title == null ? undefined : () => title
    const defaultSlot = typeof content === 'string' || content == null ? undefined : () => content
    const vnode = createVNode(
      ConfirmDialog as Component,
      {
        ...state,
        title: typeof title === 'string' ? title : '',
        content: typeof content === 'string' ? content : '',
        modalLayerParent,
        'onUpdate:show': (value: boolean) => {
          state.show = value
          renderConfirm()
        },
        onClosed: destroy,
      },
      {
        title: titleSlot,
        default: defaultSlot,
      },
    )
    render(withServiceContext(vnode, context), container)
  }

  renderConfirm()

  return {
    close,
    destroy,
    update,
  }
}
