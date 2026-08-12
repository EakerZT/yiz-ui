import { createVNode, getCurrentScope, onScopeDispose, render } from 'vue'
import {
  applyServiceTheme,
  resolveServiceTarget,
  useServiceContext,
  withServiceContext,
  type ServiceContext,
} from '../app/serviceContext'
import ContextMenu from './ContextMenu.vue'
import type { ContextMenuItem } from './ContextMenu.vue'

const TRANSITION_MS = 120

export interface ContextMenuOptions {
  x: number
  y: number
  width?: number
  menus: ContextMenuItem[]
  onSelect: (item: ContextMenuItem) => void
  onClose: () => void
}

export interface ContextMenuHandle {
  close: () => void
}

export interface ContextMenuApi {
  open: (options: ContextMenuOptions) => ContextMenuHandle
}

interface InternalContextMenuHandle extends ContextMenuHandle {
  destroy: () => void
}

const activeContextMenus = new WeakMap<ServiceContext['runtime'], InternalContextMenuHandle>()

function openContextMenu(
  { x, y, width = 200, menus, onSelect, onClose }: ContextMenuOptions,
  context: ServiceContext,
): InternalContextMenuHandle {
  // 同一个应用运行时只允许一个菜单；替换时立即卸载旧实例，避免退场动画期间短暂重叠。
  activeContextMenus.get(context.runtime)?.destroy()

  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = `${x}px`
  container.style.top = `${y}px`
  container.style.zIndex = String(context.zIndex.next())
  applyServiceTheme(container, context)

  let closing = false
  let teardownDone = false
  let listenerTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let transitionElement: HTMLElement | null = null
  let transitionEndHandler: ((event: TransitionEvent) => void) | undefined

  const handle: InternalContextMenuHandle = {
    close,
    destroy,
  }

  function removeGlobalListeners() {
    if (listenerTimer !== undefined) {
      clearTimeout(listenerTimer)
      listenerTimer = undefined
    }
    document.removeEventListener('click', onClickOutside, true)
    document.removeEventListener('keydown', onKeydown)
  }

  function teardown() {
    if (teardownDone) return
    teardownDone = true
    removeGlobalListeners()
    if (closeTimer !== undefined) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
    if (transitionElement && transitionEndHandler) {
      transitionElement.removeEventListener('transitionend', transitionEndHandler)
    }
    transitionElement = null
    transitionEndHandler = undefined
    render(null, container)
    container.remove()
    if (activeContextMenus.get(context.runtime) === handle) {
      activeContextMenus.delete(context.runtime)
    }
    onClose()
  }

  function close() {
    if (closing || teardownDone) return
    closing = true
    removeGlobalListeners()

    const inner = container.querySelector<HTMLElement>('.yiz-context-menu')
    if (!inner) {
      teardown()
      return
    }

    transitionElement = inner
    transitionEndHandler = (event: TransitionEvent) => {
      if (event.target === inner && (event.propertyName === 'opacity' || event.propertyName === 'transform')) {
        teardown()
      }
    }
    inner.addEventListener('transitionend', transitionEndHandler)
    inner.classList.remove('is-visible')
    // 兜底：即使 transitionend 未触发也确保卸载，避免 DOM 泄漏。
    closeTimer = setTimeout(teardown, TRANSITION_MS + 80)
  }

  function destroy() {
    if (teardownDone) return
    closing = true
    teardown()
  }

  function onClickOutside(event: MouseEvent) {
    if (!container.contains(event.target as HTMLElement)) {
      close()
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close()
    }
  }

  function handleSelect(item: ContextMenuItem) {
    try {
      onSelect(item)
    } finally {
      close()
    }
  }

  const vnode = createVNode(ContextMenu, {
    items: menus,
    width,
    onSelect: handleSelect,
  })

  render(withServiceContext(vnode, context), container)
  resolveServiceTarget(context).appendChild(container)
  activeContextMenus.set(context.runtime, handle)

  // 入场：先标记 host 基态（隐藏），下一帧切到可见态触发 transition。
  const inner = container.querySelector<HTMLElement>('.yiz-context-menu')
  if (inner) {
    inner.classList.add('is-host')
  }

  // 用 offsetWidth/Height 做视口修正，不受 transform: scale 影响。
  const w = container.offsetWidth
  const h = container.offsetHeight
  if (x + w > window.innerWidth) {
    container.style.left = `${Math.max(0, window.innerWidth - w - 4)}px`
  }
  if (y + h > window.innerHeight) {
    container.style.top = `${Math.max(0, window.innerHeight - h - 4)}px`
  }

  // 双 rAF 确保初始隐藏态先 paint，再切到可见态触发过渡。
  if (inner) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!closing && !teardownDone) inner.classList.add('is-visible')
      })
    })
  }

  // 延迟监听，避免触发打开的同一次点击立即关闭菜单。
  listenerTimer = setTimeout(() => {
    listenerTimer = undefined
    if (closing || teardownDone) return
    document.addEventListener('click', onClickOutside, true)
    document.addEventListener('keydown', onKeydown)
  }, 0)

  return handle
}

export function useContextMenu(): ContextMenuApi {
  const context = useServiceContext()
  let ownedHandle: ContextMenuHandle | undefined

  if (getCurrentScope()) {
    onScopeDispose(() => ownedHandle?.close())
  }

  return {
    open: (options) => {
      ownedHandle = openContextMenu(options, context)
      return ownedHandle
    },
  }
}
