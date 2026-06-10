import { createVNode, render } from 'vue'
import ContextMenu from './ContextMenu.vue'
import type { ContextMenuItem } from './ContextMenu.vue'

export function showContextMenu(
  x: number,
  y: number,
  items: ContextMenuItem[],
  callback: (item: ContextMenuItem) => void
) {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = `${x}px`
  container.style.top = `${y}px`
  container.style.zIndex = '3000'

  let removed = false

  function close() {
    if (removed) return
    removed = true
    render(null, container)
    document.body.removeChild(container)
    document.removeEventListener('click', onClickOutside, true)
    document.removeEventListener('keydown', onKeydown)
  }

  function onClickOutside(e: MouseEvent) {
    if (!container.contains(e.target as HTMLElement)) {
      close()
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close()
    }
  }

  function onSelect(item: ContextMenuItem) {
    callback(item)
    close()
  }

  const vnode = createVNode(ContextMenu, {
    items,
    onSelect
  })

  render(vnode, container)
  document.body.appendChild(container)

  // adjust position to keep menu within viewport
  const rect = container.getBoundingClientRect()
  if (x + rect.width > window.innerWidth) {
    container.style.left = `${Math.max(0, window.innerWidth - rect.width - 4)}px`
  }
  if (y + rect.height > window.innerHeight) {
    container.style.top = `${Math.max(0, window.innerHeight - rect.height - 4)}px`
  }

  // defer to avoid the same click that triggered it from closing it
  setTimeout(() => {
    document.addEventListener('click', onClickOutside, true)
    document.addEventListener('keydown', onKeydown)
  }, 0)
}
