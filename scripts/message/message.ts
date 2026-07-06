import { createVNode, isVNode, render, type Component, type VNodeChild } from 'vue'
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
  key?: MessageKey
  close: () => void
  update: (options: MessageOptions) => void
}

const GAP = 8
const DEFAULT_DURATION = 3000
const instances: MessageInstance[] = []
const keyedInstances = new Map<MessageKey, MessageInstance>()
let holder: HTMLElement | null = null

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
  if (instance.key != null && keyedInstances.get(instance.key) === instance) {
    keyedInstances.delete(instance.key)
  }
}

function openMessage(rawOptions: MessageOptions = {}): MessageHandle {
  const key = rawOptions.key
  if (key != null) {
    const existed = keyedInstances.get(key)
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
  getHolder().appendChild(container)

  const instance: MessageInstance = {
    key,
    close,
    update,
  }
  instances.push(instance)
  if (key != null) {
    keyedInstances.set(key, instance)
  }

  function destroy() {
    render(null, container)
    container.remove()
    removeInstance(instance)
    removeHolderIfEmpty()
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
    render(vnode, container)
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

function getHolder() {
  if (holder) return holder

  holder = document.createElement('div')
  holder.className = 'yiz-message-holder'
  holder.style.position = 'fixed'
  holder.style.zIndex = '3000'
  holder.style.top = '24px'
  holder.style.left = '50%'
  holder.style.transform = 'translateX(-50%)'
  holder.style.display = 'flex'
  holder.style.flexDirection = 'column'
  holder.style.alignItems = 'center'
  holder.style.pointerEvents = 'none'

  document.body.appendChild(holder)
  return holder
}

function removeHolderIfEmpty() {
  if (!holder || holder.childElementCount > 0) return
  holder.remove()
  holder = null
}

function openTypedMessage(
  type: MessageType,
  content?: MessageContent | Omit<MessageOptions, 'type'>,
  duration?: number,
  onClose?: () => void,
) {
  return openMessage({
    ...normalizeOptions(content, duration, onClose),
    type,
  })
}

export const message = ((content?: MessageContent | MessageOptions, duration?: number, onClose?: () => void) =>
  openMessage(normalizeOptions(content, duration, onClose))) as MessageFn

message.open = (options: MessageOptions) => openMessage(options)
message.info = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('info', content, duration, onClose)
message.success = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('success', content, duration, onClose)
message.warning = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('warning', content, duration, onClose)
message.warn = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('warning', content, duration, onClose)
message.error = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('error', content, duration, onClose)
message.loading = (content?: MessageContent | Omit<MessageOptions, 'type'>, duration?: number, onClose?: () => void) =>
  openTypedMessage('loading', content, duration, onClose)
message.destroy = (key?: MessageKey) => {
  if (key != null) {
    keyedInstances.get(key)?.close()
    return
  }
  instances.slice().forEach((instance) => instance.close())
}
