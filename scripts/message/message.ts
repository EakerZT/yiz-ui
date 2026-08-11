import { createVNode, isVNode, render, type Component, type VNodeChild } from 'vue'
import {
  applyServiceTheme,
  resolveServiceTarget,
  useServiceContext,
  withServiceContext,
  type ServiceContext,
} from '../app/serviceContext'
import type { ThemeContext } from '../theme'
import { nextZIndex } from '../zIndex'
import Message from './Message.vue'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'
export type MessageKey = string | number
export type MessageContent = string | VNodeChild

export interface MessageOptions {
  content?: MessageContent
  type?: MessageType
  duration?: number
  key?: MessageKey
  icon?: Component
  showIcon?: boolean
  onClose?: () => void
}

export interface MessageHandle {
  close: () => void
}

export interface MessageFn {
  (content?: MessageContent | MessageOptions, duration?: number, onClose?: () => void): MessageHandle
  open: (options: MessageOptions) => MessageHandle
  info: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  success: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  warning: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  warn: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  error: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  loading: (
    content?: MessageContent | Omit<MessageOptions, 'type'>,
    duration?: number,
    onClose?: () => void,
  ) => MessageHandle
  destroy: (key?: MessageKey) => void
}

interface MessageInstance {
  scope: MessageScope
  key?: MessageKey
  close: () => void
  update: (options: MessageOptions) => void
}

const GAP = 8
const DEFAULT_DURATION = 3000
const instances: MessageInstance[] = []
type MessageScope = ThemeContext | typeof globalScope
const globalScope = Symbol('yizGlobalMessageScope')
const keyedInstances = new Map<MessageScope, Map<MessageKey, MessageInstance>>()
const holders = new Map<MessageScope, HTMLElement>()

function getScope(context?: ServiceContext): MessageScope {
  return context?.theme ?? globalScope
}

function getKeyedInstances(scope: MessageScope) {
  let scoped = keyedInstances.get(scope)
  if (!scoped) {
    scoped = new Map<MessageKey, MessageInstance>()
    keyedInstances.set(scope, scoped)
  }
  return scoped
}

function isMessageOptions(value: MessageContent | MessageOptions | undefined): value is MessageOptions {
  if (value == null || typeof value !== 'object' || Array.isArray(value) || isVNode(value)) return false
  return ['content', 'type', 'duration', 'key', 'icon', 'showIcon', 'onClose'].some((key) => key in value)
}

function normalizeOptions(
  contentOrOptions: MessageContent | MessageOptions | undefined,
  duration?: number,
  onClose?: () => void,
): MessageOptions {
  if (isMessageOptions(contentOrOptions)) {
    return {
      ...contentOrOptions,
      duration: duration ?? contentOrOptions.duration,
      onClose: onClose ?? contentOrOptions.onClose,
    }
  }
  return {
    content: contentOrOptions,
    duration,
    onClose,
  }
}

function removeInstance(instance: MessageInstance) {
  const index = instances.indexOf(instance)
  if (index >= 0) {
    instances.splice(index, 1)
  }
  if (instance.key != null && keyedInstances.get(instance.scope)?.get(instance.key) === instance) {
    keyedInstances.get(instance.scope)?.delete(instance.key)
  }
}

function openMessage(rawOptions: MessageOptions = {}, context?: ServiceContext): MessageHandle {
  const scope = getScope(context)
  const scopedKeyedInstances = getKeyedInstances(scope)
  const key = rawOptions.key
  if (key != null) {
    const existed = scopedKeyedInstances.get(key)
    if (existed) {
      existed.update(rawOptions)
      return { close: existed.close }
    }
  }

  const container = document.createElement('div')
  let options = applyDefaults(rawOptions)
  let closed = false
  let closeEmitted = false

  setupContainer(container)
  getHolder(scope, context).appendChild(container)

  const instance: MessageInstance = {
    scope,
    key,
    close,
    update,
  }
  instances.push(instance)
  if (key != null) {
    scopedKeyedInstances.set(key, instance)
  }

  function destroy() {
    render(null, container)
    container.remove()
    removeInstance(instance)
    removeHolderIfEmpty(scope)
  }

  function close() {
    if (closed) return
    closed = true
    emitClose()
    renderMessage(false)
    collapseContainer(container)
  }

  function closeFromComponent() {
    if (closed) return
    closed = true
    renderMessage(false)
    collapseContainer(container)
  }

  function emitClose() {
    if (closeEmitted) return
    closeEmitted = true
    options.onClose?.()
  }

  function update(nextOptions: MessageOptions) {
    if (closed) return
    options = applyDefaults({
      ...options,
      ...nextOptions,
      key,
    })
    renderMessage(true)
    expandContainer(container)
  }

  function renderMessage(modelValue: boolean) {
    const defaultSlot =
      typeof options.content === 'string' || options.content == null ? undefined : () => options.content
    const vnode = createVNode(
      Message,
      {
        content: typeof options.content === 'string' ? options.content : '',
        type: options.type,
        duration: options.duration,
        icon: options.icon,
        showIcon: options.showIcon,
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
        default: defaultSlot,
      },
    )
    render(withServiceContext(vnode, context), container)
  }

  renderMessage(true)
  expandContainer(container)

  return {
    close,
  }
}

function applyDefaults(options: MessageOptions): MessageOptions {
  const type = options.type ?? 'info'
  return {
    ...options,
    type,
    duration: options.duration ?? (type === 'loading' ? 0 : DEFAULT_DURATION),
    showIcon: options.showIcon ?? true,
  }
}

function setupContainer(container: HTMLElement) {
  container.className = 'yiz-message-service-item'
  container.style.overflow = 'visible'
  container.style.height = '0px'
  container.style.marginBottom = '0px'
  container.style.transition = 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1), margin 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  container.style.pointerEvents = 'auto'
  container.style.textAlign = 'center'
}

function expandContainer(container: HTMLElement) {
  requestAnimationFrame(() => {
    container.style.height = `${container.scrollHeight}px`
    container.style.marginBottom = `${GAP}px`
  })
}

function collapseContainer(container: HTMLElement) {
  if (container.dataset.collapsing === 'true') return
  container.dataset.collapsing = 'true'
  container.style.height = `${container.offsetHeight || container.scrollHeight}px`
  void container.offsetHeight
  requestAnimationFrame(() => {
    container.style.height = '0px'
    container.style.marginBottom = '0px'
  })
}

function getHolder(scope: MessageScope, context?: ServiceContext) {
  const existed = holders.get(scope)
  if (existed) {
    applyServiceTheme(existed, context)
    return existed
  }

  const holder = document.createElement('div')
  holder.className = 'yiz-message-holder'
  holder.style.position = 'fixed'
  holder.style.zIndex = String(context?.zIndex.next() ?? nextZIndex())
  holder.style.top = '24px'
  holder.style.left = '50%'
  holder.style.transform = 'translateX(-50%)'
  holder.style.display = 'flex'
  holder.style.flexDirection = 'column'
  holder.style.alignItems = 'center'
  holder.style.pointerEvents = 'none'

  applyServiceTheme(holder, context)
  resolveServiceTarget(context).appendChild(holder)
  holders.set(scope, holder)
  return holder
}

function removeHolderIfEmpty(scope: MessageScope) {
  const holder = holders.get(scope)
  if (!holder || holder.childElementCount > 0) return
  holder.remove()
  holders.delete(scope)
  keyedInstances.delete(scope)
}

function openTypedMessage(
  type: MessageType,
  content?: MessageContent | Omit<MessageOptions, 'type'>,
  duration?: number,
  onClose?: () => void,
  context?: ServiceContext,
) {
  return openMessage(
    {
      ...normalizeOptions(content, duration, onClose),
      type,
    },
    context,
  )
}

function createMessageApi(context?: ServiceContext): MessageFn {
  const api = ((content?: MessageContent | MessageOptions, duration?: number, onClose?: () => void) =>
    openMessage(normalizeOptions(content, duration, onClose), context)) as MessageFn

  api.open = (options: MessageOptions) => openMessage(options, context)
  api.info = (content, duration, onClose) => openTypedMessage('info', content, duration, onClose, context)
  api.success = (content, duration, onClose) => openTypedMessage('success', content, duration, onClose, context)
  api.warning = (content, duration, onClose) => openTypedMessage('warning', content, duration, onClose, context)
  api.warn = (content, duration, onClose) => openTypedMessage('warning', content, duration, onClose, context)
  api.error = (content, duration, onClose) => openTypedMessage('error', content, duration, onClose, context)
  api.loading = (content, duration, onClose) => openTypedMessage('loading', content, duration, onClose, context)
  api.destroy = (key?: MessageKey) => destroyMessages(getScope(context), key)
  return api
}

function destroyMessages(scope: MessageScope, key?: MessageKey) {
  if (key != null) {
    keyedInstances.get(scope)?.get(key)?.close()
    return
  }
  instances.filter((instance) => instance.scope === scope).forEach((instance) => instance.close())
}

export const message = createMessageApi()

export function useMessage(): MessageFn {
  return createMessageApi(useServiceContext())
}
