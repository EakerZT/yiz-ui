import { createVNode, render, type VNodeChild } from 'vue'
import Notification from './Notification.vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface NotificationOptions {
  title?: string | VNodeChild
  content?: string | VNodeChild
  type?: NotificationType
  placement?: NotificationPlacement
  duration?: number
  closable?: boolean
  showIcon?: boolean
  offset?: number
  width?: number | string
  onClose?: () => void
}

export interface NotificationHandle {
  close: () => void
}

export interface NotificationFn {
  (options?: NotificationOptions): NotificationHandle
  info: (options?: Omit<NotificationOptions, 'type'>) => NotificationHandle
  success: (options?: Omit<NotificationOptions, 'type'>) => NotificationHandle
  warning: (options?: Omit<NotificationOptions, 'type'>) => NotificationHandle
  error: (options?: Omit<NotificationOptions, 'type'>) => NotificationHandle
}

interface NotificationInstance {
  placement: NotificationPlacement
  close: () => void
}

const GAP = 12
const instances: NotificationInstance[] = []
const holders = new Map<NotificationPlacement, HTMLElement>()

function removeInstance(instance: NotificationInstance) {
  const index = instances.indexOf(instance)
  if (index >= 0) {
    instances.splice(index, 1)
  }
}

function openNotification(options: NotificationOptions = {}): NotificationHandle {
  const container = document.createElement('div')
  const placement = options.placement ?? 'top-right'
  const baseOffset = options.offset ?? 24
  let closed = false
  let closeEmitted = false

  const holder = getHolder(placement, baseOffset)
  setupContainer(container, placement)
  holder.appendChild(container)

  const instance: NotificationInstance = {
    placement,
    close,
  }
  instances.push(instance)

  function destroy() {
    render(null, container)
    container.remove()
    removeInstance(instance)
    removeHolderIfEmpty(placement)
  }

  function close() {
    if (closed) return
    closed = true
    emitClose()
    renderNotification(false)
    collapseContainer(container, placement)
  }

  function closeFromComponent() {
    if (closed) return
    closed = true
    renderNotification(false)
    collapseContainer(container, placement)
  }

  function emitClose() {
    if (closeEmitted) return
    closeEmitted = true
    options.onClose?.()
  }

  const titleSlot = typeof options.title === 'string' || options.title == null ? undefined : () => options.title
  const defaultSlot = typeof options.content === 'string' || options.content == null ? undefined : () => options.content

  function renderNotification(modelValue: boolean) {
    const vnode = createVNode(
      Notification,
      {
        ...options,
        title: typeof options.title === 'string' ? options.title : '',
        content: typeof options.content === 'string' ? options.content : '',
        type: options.type ?? 'info',
        placement,
        duration: options.duration ?? 4500,
        closable: options.closable ?? true,
        showIcon: options.showIcon ?? true,
        offset: baseOffset,
        width: options.width ?? 360,
        inline: true,
        modelValue,
        'onUpdate:modelValue': (value: boolean) => {
          if (!value) closeFromComponent()
        },
        onClose: () => {
          emitClose()
        },
        onDestroy: destroy,
      },
      {
        title: titleSlot,
        default: defaultSlot,
      },
    )

    render(vnode, container)
  }

  renderNotification(true)
  expandContainer(container, placement)

  return {
    close,
  }
}

function setupContainer(container: HTMLElement, placement: NotificationPlacement) {
  const marginProperty = getMarginProperty(placement)
  container.className = 'yiz-notification-service-item'
  container.style.overflow = 'hidden'
  container.style.height = '0px'
  container.style[marginProperty] = '0px'
  container.style.transition = 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  container.style.pointerEvents = 'auto'
}

function expandContainer(container: HTMLElement, placement: NotificationPlacement) {
  const marginProperty = getMarginProperty(placement)
  requestAnimationFrame(() => {
    container.style.height = `${container.scrollHeight}px`
    container.style[marginProperty] = `${GAP}px`
  })
}

function collapseContainer(container: HTMLElement, placement: NotificationPlacement) {
  const marginProperty = getMarginProperty(placement)
  if (container.dataset.collapsing === 'true') return
  container.dataset.collapsing = 'true'
  container.style.height = `${container.offsetHeight || container.scrollHeight}px`
  void container.offsetHeight
  requestAnimationFrame(() => {
    container.style.height = '0px'
    container.style[marginProperty] = '0px'
  })
}

function getMarginProperty(placement: NotificationPlacement): 'marginTop' | 'marginBottom' {
  return placement.startsWith('bottom') ? 'marginTop' : 'marginBottom'
}

function getHolder(placement: NotificationPlacement, offset: number) {
  const existed = holders.get(placement)
  if (existed) return existed

  const holder = document.createElement('div')
  holder.className = `yiz-notification-holder yiz-notification-holder-${placement}`
  holder.style.position = 'fixed'
  holder.style.zIndex = '3000'
  holder.style.display = 'flex'
  holder.style.flexDirection = placement.startsWith('bottom') ? 'column-reverse' : 'column'
  holder.style.pointerEvents = 'none'

  const [vertical, horizontal] = placement.split('-')
  holder.style[vertical as 'top' | 'bottom'] = `${offset}px`
  holder.style[horizontal as 'left' | 'right'] = `${offset}px`

  document.body.appendChild(holder)
  holders.set(placement, holder)
  return holder
}

function removeHolderIfEmpty(placement: NotificationPlacement) {
  const holder = holders.get(placement)
  if (!holder || holder.childElementCount > 0) return
  holder.remove()
  holders.delete(placement)
}

export const notification = openNotification as NotificationFn

notification.info = (options: Omit<NotificationOptions, 'type'> = {}) => notification({ ...options, type: 'info' })
notification.success = (options: Omit<NotificationOptions, 'type'> = {}) =>
  notification({ ...options, type: 'success' })
notification.warning = (options: Omit<NotificationOptions, 'type'> = {}) =>
  notification({ ...options, type: 'warning' })
notification.error = (options: Omit<NotificationOptions, 'type'> = {}) => notification({ ...options, type: 'error' })
