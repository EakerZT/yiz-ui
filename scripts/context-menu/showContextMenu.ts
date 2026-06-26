import { createVNode, render } from 'vue'
import ContextMenu from './ContextMenu.vue'
import type { ContextMenuItem } from './ContextMenu.vue'

const TRANSITION_MS = 120

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

  function teardown() {
    render(null, container)
    if (container.parentNode) document.body.removeChild(container)
  }

  function close() {
    if (removed) return
    removed = true
    document.removeEventListener('click', onClickOutside, true)
    document.removeEventListener('keydown', onKeydown)

    const inner = container.firstElementChild as HTMLElement | null
    if (inner) {
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        inner.removeEventListener('transitionend', onEnd)
        teardown()
      }
      const onEnd = (e: TransitionEvent) => {
        if (e.target === inner && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
          finish()
        }
      }
      inner.addEventListener('transitionend', onEnd)
      inner.classList.remove('is-visible')
      // 兜底:即使 transitionend 未触发也确保卸载，避免 DOM 泄漏
      setTimeout(finish, TRANSITION_MS + 80)
    } else {
      teardown()
    }
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

  // 入场:先标记 host 基态（隐藏），下一帧切到可见态触发 transition
  const inner = container.firstElementChild as HTMLElement | null
  if (inner) {
    inner.classList.add('is-host')
  }

  // 用 offsetWidth/Height 做视口修正，不受 transform: scale 影响
  const w = container.offsetWidth
  const h = container.offsetHeight
  if (x + w > window.innerWidth) {
    container.style.left = `${Math.max(0, window.innerWidth - w - 4)}px`
  }
  if (y + h > window.innerHeight) {
    container.style.top = `${Math.max(0, window.innerHeight - h - 4)}px`
  }

  // 双 rAF 确保初始隐藏态先 paint，再切到可见态触发过渡
  if (inner) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!removed) inner.classList.add('is-visible')
      })
    })
  }

  // defer to avoid the same click that triggered it from closing it
  setTimeout(() => {
    document.addEventListener('click', onClickOutside, true)
    document.addEventListener('keydown', onKeydown)
  }, 0)
}
