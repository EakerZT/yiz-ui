import type { InjectionKey, Ref } from 'vue'

export type CarouselDirection = 'horizontal' | 'vertical'
export type CarouselArrow = 'always' | 'hover' | 'never'
export type CarouselIndicatorPosition = 'inside' | 'outside' | 'none'
export type CarouselTrigger = 'click' | 'hover'

export interface CarouselContext {
  activeIndex: Ref<number>
  direction: Ref<CarouselDirection>
  registerItem: (id: symbol, element: HTMLElement) => void
  unregisterItem: (id: symbol) => void
  getItemIndex: (id: symbol) => number
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol('yizCarousel')
