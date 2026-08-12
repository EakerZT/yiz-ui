import { createVNode, render, type VNodeChild } from 'vue'
import {
  applyServiceTheme,
  resolveServiceTarget,
  useServiceContext,
  withServiceContext,
  type ServiceContext,
} from '../app/serviceContext'
import { createTranslator } from '../locale'
import type { ThemeContext } from '../theme'
import { nextZIndex } from '../zIndex'
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
  scope: NotificationScope
  placement: NotificationPlacement
  close: () => void
}

const GAP = 12
const instances: NotificationInstance[] = []
const globalScope = Symbol('yizGlobalNotificationScope')
type NotificationScope = ThemeContext | typeof globalScope
const holders = new Map<NotificationScope, Map<NotificationPlacement, HTMLElement>>()
const defaultTitleKeys: Record<NotificationType, string> = {
  info: 'notification.title.info',
  success: 'notification.title.success',
  warning: 'notification.title.warning',
  error: 'notification.title.error',
}

function removeInstance(instance: NotificationInstance) {
  const index = instances.indexOf(instance)
  if (index >= 0) {
    instances.splice(index, 1)
  }
}

function getScope(context?: ServiceContext): NotificationScope {
  return context?.theme ?? globalScope
}

function openNotification(options: NotificationOptions = {}, context?: ServiceContext): NotificationHandle {
  const scope = getScope(context)
  const container = document.createElement('div')
  const type = options.type ?? 'info'
  const placement = options.placement ?? 'top-right'
  const baseOffset = options.offset ?? 24
  let closed = false
  let closeEmitted = false

  const holder = getHolder(scope, placement, baseOffset, context)
  setupContainer(container, placement)
  holder.appendChild(container)

  const instance: NotificationInstance = {
    scope,
    placement,
    close,
  }
  instances.push(instance)

  function destroy() {
    render(null, container)
    container.remove()
    removeInstance(instance)
    removeHolderIfEmpty(scope, placement)
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

  const title = options.title == null ? createTranslator(context?.locale)(defaultTitleKeys[type]) : options.title
  const titleSlot = typeof title === 'string' ? undefined : () => title
  const defaultSlot = typeof options.content === 'string' || options.content == null ? undefined : () => options.content

  function renderNotification(modelValue: boolean) {
    const vnode = createVNode(
      Notification,
      {
        ...options,
        title: typeof title === 'string' ? title : '',
        content: typeof options.content === 'string' ? options.content : '',
        type,
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

    render(withServiceContext(vnode, context), container)
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
  container.style.overflow = 'visible'
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

function getHolder(
  scope: NotificationScope,
  placement: NotificationPlacement,
  offset: number,
  context?: ServiceContext,
) {
  let scopedHolders = holders.get(scope)
  if (!scopedHolders) {
    scopedHolders = new Map<NotificationPlacement, HTMLElement>()
    holders.set(scope, scopedHolders)
  }
  const existed = scopedHolders.get(placement)
  if (existed) return existed

  const holder = document.createElement('div')
  holder.className = `yiz-notification-holder yiz-notification-holder-${placement}`
  holder.style.position = 'fixed'
  holder.style.zIndex = String(context?.zIndex.next() ?? nextZIndex())
  holder.style.display = 'flex'
  holder.style.flexDirection = placement.startsWith('bottom') ? 'column-reverse' : 'column'
  holder.style.pointerEvents = 'none'

  const [vertical, horizontal] = placement.split('-')
  holder.style[vertical as 'top' | 'bottom'] = `${offset}px`
  holder.style[horizontal as 'left' | 'right'] = `${offset}px`

  applyServiceTheme(holder, context)
  resolveServiceTarget(context).appendChild(holder)
  scopedHolders.set(placement, holder)
  return holder
}

function removeHolderIfEmpty(scope: NotificationScope, placement: NotificationPlacement) {
  const scopedHolders = holders.get(scope)
  const holder = scopedHolders?.get(placement)
  if (!holder || holder.childElementCount > 0) return
  holder.remove()
  scopedHolders?.delete(placement)
  if (scopedHolders?.size === 0) holders.delete(scope)
}

function createNotificationApi(context?: ServiceContext): NotificationFn {
  const api = ((options: NotificationOptions = {}) => openNotification(options, context)) as NotificationFn
  api.info = (options = {}) => api({ ...options, type: 'info' })
  api.success = (options = {}) => api({ ...options, type: 'success' })
  api.warning = (options = {}) => api({ ...options, type: 'warning' })
  api.error = (options = {}) => api({ ...options, type: 'error' })
  return api
}

export function useNotification(): NotificationFn {
  return createNotificationApi(useServiceContext())
}
