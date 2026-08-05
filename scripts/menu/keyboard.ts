function getVisibleMenuItems(current: HTMLElement) {
  const menu = current.closest('.yiz-menu')
  if (!menu) return []
  return Array.from(menu.querySelectorAll<HTMLElement>('.yiz-menu-item[role="menuitem"]')).filter(
    (item) => item.offsetParent !== null,
  )
}

export function moveMenuFocus(current: HTMLElement, target: 'next' | 'previous' | 'first' | 'last') {
  const items = getVisibleMenuItems(current)
  if (items.length === 0) return
  const currentIndex = Math.max(0, items.indexOf(current))
  let targetIndex = currentIndex

  if (target === 'next') targetIndex = (currentIndex + 1) % items.length
  if (target === 'previous') targetIndex = (currentIndex - 1 + items.length) % items.length
  if (target === 'first') targetIndex = 0
  if (target === 'last') targetIndex = items.length - 1

  items[targetIndex]?.focus()
}
