import type { LoadingBarDirection } from './types'

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function toBarPerc(n: number, direction: LoadingBarDirection): number {
  if (direction === 'rtl') return (1 - n) * 100
  return (-1 + n) * 100
}

export function toCss(element: HTMLElement, props: Record<string, string>): void {
  for (const key in props) {
    const value = props[key]
    if (value === undefined || value === null) {
      element.style.removeProperty(key)
    } else {
      element.style.setProperty(key, value)
    }
  }
}

export function addClass(element: Element, name: string): void {
  element.classList.add(name)
}

export function removeClass(element: Element, name: string): void {
  element.classList.remove(name)
}

export function removeElement(element: Element): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}
