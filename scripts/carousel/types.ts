import type { InjectionKey, Ref } from 'vue'

export type CarouselDotPosition = 'top' | 'bottom' | 'left' | 'right'
export type CarouselArrow = 'always' | 'hover' | 'never'
export type CarouselIndicatorPosition = 'inside' | 'outside' | 'none'
export type CarouselTrigger = 'click' | 'hover'

export interface CarouselContext {
  activeIndex: Ref<number>
  registerItem: (id: symbol, element: HTMLElement) => void
  unregisterItem: (id: symbol) => void
  getItemIndex: (id: symbol) => number
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol('yizCarousel')
