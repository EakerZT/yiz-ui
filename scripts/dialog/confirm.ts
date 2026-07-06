import { createVNode, render, type Component, type VNodeChild } from 'vue'
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

const DESTROY_DELAY = 300

export function confirm(options: DialogConfirmOptions = {}): DialogConfirmHandle {
  const container = document.createElement('div')
  let state: DialogConfirmOptions & { show: boolean } = {
    ...options,
    show: true,
  }
  let destroyed = false
  let destroyTimer: ReturnType<typeof setTimeout> | null = null

  document.body.appendChild(container)

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
        'onUpdate:show': (value: boolean) => {
          state.show = value
        },
        onClosed: close,
      },
      {
        title: titleSlot,
        default: defaultSlot,
      },
    )
    render(vnode, container)
  }

  renderConfirm()

  return {
    close,
    destroy,
    update,
  }
}
